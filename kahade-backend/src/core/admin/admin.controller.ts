import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Logger,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { JwtGuard } from '@security/guards/jwt.guard';
import { RolesGuard } from '@security/guards/roles.guard';
import { MfaGuard, RequireMFA } from '@security/guards/mfa.guard';
import { Roles } from '@security/decorators/roles.decorator';
import { Role } from '@security/rbac/roles.enum';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { Throttle } from '@nestjs/throttler';
import { WithdrawalStatus, PaymentStatus, OrderStatus } from '@prisma/client';

// AuditAction enum
const AuditAction = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
} as const;
type AuditAction = typeof AuditAction[keyof typeof AuditAction];

// ============================================================================
// BANK-GRADE ADMIN CONTROLLER
// Implements: MFA Enforcement, Dual Approval, Audit Trail, Privilege Separation
// ============================================================================

interface WalletAdjustmentDto {
  userId: string;
  amountMinor: string; // Use string to handle BigInt
  reason: string;
  type: 'CREDIT' | 'DEBIT';
}

interface ApproveAdjustmentDto {
  notes?: string;
}

interface UserSuspendDto {
  reason: string;
  duration?: number; // Duration in hours, null for permanent
}

@Controller('admin')
@UseGuards(JwtGuard, RolesGuard, MfaGuard)
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(private readonly prisma: PrismaService) {}

  // ============================================================================
  // DASHBOARD & MONITORING
  // ============================================================================

  @Get('health')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('dashboard/stats')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @RequireMFA()
  async getDashboardStats() {
    const [
      totalUsers,
      activeOrders,
      pendingWithdrawals,
      pendingDisputes,
      todayVolume,
    ] = await Promise.all([
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.order.count({
        where: { status: { in: [OrderStatus.PAID, OrderStatus.DISPUTED] } },
      }),
      this.prisma.withdrawal.count({
        where: { status: WithdrawalStatus.PENDING },
      }),
      this.prisma.dispute.count({ where: { status: 'OPEN' } }),
      this.prisma.payment.aggregate({
        where: {
          status: PaymentStatus.SUCCESS,
          paidAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
        _sum: { amountMinor: true },
      }),
    ]);

    return {
      totalUsers,
      activeOrders,
      pendingWithdrawals,
      pendingDisputes,
      todayVolume: todayVolume._sum?.amountMinor?.toString() ?? '0',
    };
  }

  // ============================================================================
  // WALLET ADJUSTMENTS (BANK-GRADE: Requires Dual Approval)
  // ============================================================================

  /**
   * BANK-GRADE: Request wallet adjustment (requires second admin approval)
   */
  @Post('wallet/adjustment')
  @Roles(Role.SUPER_ADMIN)
  @RequireMFA()
  @Throttle({ default: { limit: 10, ttl: 3600000 } }) // 10 per hour
  async requestWalletAdjustment(
    @CurrentUser() admin: any,
    @Body() dto: WalletAdjustmentDto,
  ) {
    // Validate reason length (BANK RULE: detailed reason required)
    if (!dto.reason || dto.reason.length < 20) {
      throw new BadRequestException(
        'Detailed reason required (minimum 20 characters)',
      );
    }

    // Validate user exists
    const targetUser = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!targetUser) {
      throw new NotFoundException('Target user not found');
    }

    // Cannot adjust own wallet
    if (dto.userId === admin.id) {
      throw new ForbiddenException('Cannot adjust your own wallet');
    }

    const amountMinor = BigInt(dto.amountMinor);

    // Create adjustment request (NOT auto-executed)
    const adjustment = await this.prisma.walletAdjustment.create({
      data: {
        userId: dto.userId,
        amountMinor: dto.type === 'DEBIT' ? -amountMinor : amountMinor,
        reason: dto.reason,
        type: dto.type,
        requestedBy: admin.id,
        status: 'PENDING_APPROVAL',
      },
    });

    // Create audit log
    await this.createAuditLog(admin.id, AuditAction.CREATE, 'WalletAdjustment', adjustment.id, {
      targetUserId: dto.userId,
      amount: dto.amountMinor,
      type: dto.type,
      reason: dto.reason,
    });

    this.logger.log(
      `Wallet adjustment requested by ${admin.id} for user ${dto.userId}: ${dto.type} ${dto.amountMinor}`,
    );

    return {
      id: adjustment.id,
      status: 'PENDING_APPROVAL',
      message: 'Adjustment request created. Requires approval from another admin.',
    };
  }

  /**
   * BANK-GRADE: Approve wallet adjustment (different admin required)
   */
  @Post('wallet/adjustment/:id/approve')
  @Roles(Role.SUPER_ADMIN)
  @RequireMFA()
  async approveWalletAdjustment(
    @Param('id') id: string,
    @CurrentUser() approver: any,
    @Body() dto: ApproveAdjustmentDto,
  ) {
    const adjustment = await this.prisma.walletAdjustment.findUnique({
      where: { id },
    });

    if (!adjustment) {
      throw new NotFoundException('Adjustment request not found');
    }

    if (adjustment.status !== 'PENDING_APPROVAL') {
      throw new BadRequestException(
        `Cannot approve adjustment in ${adjustment.status} status`,
      );
    }

    // BANK RULE: Different admin must approve
    if (adjustment.requestedBy === approver.id) {
      throw new ForbiddenException(
        'Cannot approve your own adjustment request. Another admin must approve.',
      );
    }

    // Execute adjustment in transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Get wallet
      const wallet = await tx.wallet.findUnique({
        where: { userId: adjustment.userId },
      });

      if (!wallet) {
        throw new NotFoundException('User wallet not found');
      }

      // For debit, check sufficient balance
      if (adjustment.amountMinor < 0n) {
        const availableBalance = wallet.balanceMinor - wallet.lockedMinor;
        if (availableBalance < -adjustment.amountMinor) {
          throw new BadRequestException('Insufficient balance for debit adjustment');
        }
      }

      // Update wallet
      await tx.wallet.update({
        where: { userId: adjustment.userId },
        data: {
          balanceMinor: { increment: adjustment.amountMinor },
          version: { increment: 1 },
        },
      });

      // Update adjustment status
      const updatedAdjustment = await tx.walletAdjustment.update({
        where: { id },
        data: {
          status: 'APPROVED',
          approvedBy: approver.id,
          approvedAt: new Date(),
          approverNotes: notes,
        },
      });

      return updatedAdjustment;
    });

    // Create audit log
    await this.createAuditLog(approver.id, AuditAction.UPDATE, 'WalletAdjustment', id, {
      action: 'APPROVED',
      targetUserId: adjustment.userId,
      amount: adjustment.amountMinor.toString(),
      requestedBy: adjustment.requestedBy,
    });

    this.logger.log(
      `Wallet adjustment ${id} approved by ${approver.id}`,
    );

    return {
      id: result.id,
      status: 'APPROVED',
      message: 'Adjustment approved and executed successfully',
    };
  }

  /**
   * BANK-GRADE: Reject wallet adjustment
   */
  @Post('wallet/adjustment/:id/reject')
  @Roles(Role.SUPER_ADMIN)
  @RequireMFA()
  async rejectWalletAdjustment(
    @Param('id') id: string,
    @CurrentUser() rejector: any,
    @Body() dto: { reason: string },
  ) {
    if (!dto.reason || dto.reason.length < 10) {
      throw new BadRequestException('Rejection reason required');
    }

    const adjustment = await this.prisma.walletAdjustment.findUnique({
      where: { id },
    });

    if (!adjustment) {
      throw new NotFoundException('Adjustment request not found');
    }

    if (adjustment.status !== 'PENDING_APPROVAL') {
      throw new BadRequestException(
        `Cannot reject adjustment in ${adjustment.status} status`,
      );
    }

    const result = await this.prisma.walletAdjustment.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejectedBy: rejector.id,
        rejectedAt: new Date(),
        rejectionReason: dto.reason,
      },
    });

    await this.createAuditLog(rejector.id, AuditAction.UPDATE, 'WalletAdjustment', id, {
      action: 'REJECTED',
      reason: dto.reason,
    });

    return {
      id: result.id,
      status: 'REJECTED',
      message: 'Adjustment request rejected',
    };
  }

  // ============================================================================
  // WITHDRAWAL MANAGEMENT
  // ============================================================================

  @Get('withdrawals/pending')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.FINANCE_MANAGER)
  @RequireMFA()
  async getPendingWithdrawals(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const skip = (page - 1) * limit;

    const [withdrawals, total] = await Promise.all([
      this.prisma.withdrawal.findMany({
        where: {
          status: WithdrawalStatus.PENDING,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              kycStatus: true,
            },
          },
          bankAccount: true,
        },
        orderBy: { requestedAt: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.withdrawal.count({
        where: { status: WithdrawalStatus.PENDING },
      }),
    ]);

    return {
      data: withdrawals,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  @Get('withdrawals/flagged')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.COMPLIANCE_OFFICER)
  @RequireMFA()
  async getFlaggedWithdrawals() {
    const withdrawals = await this.prisma.withdrawal.findMany({
      where: {
        isFlaggedBySystem: true,
        status: WithdrawalStatus.PENDING,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            kycStatus: true,
          },
        },
        bankAccount: true,
      },
      orderBy: { requestedAt: 'asc' },
    });

    return withdrawals;
  }

  @Post('withdrawals/:id/approve')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.FINANCE_MANAGER)
  @RequireMFA()
  async approveWithdrawal(
    @Param('id') id: string,
    @CurrentUser() admin: any,
    @Body() dto: { notes?: string },
  ) {
    const withdrawal = await this.prisma.withdrawal.findUnique({
      where: { id },
    });

    if (!withdrawal) {
      throw new NotFoundException('Withdrawal not found');
    }

    if (withdrawal.status !== WithdrawalStatus.PENDING) {
      throw new BadRequestException(
        `Cannot approve withdrawal in ${withdrawal.status} status`,
      );
    }

    const result = await this.prisma.withdrawal.update({
      where: { id },
      data: {
        status: WithdrawalStatus.APPROVED,
        approvedBy: admin.id,
        approvedAt: new Date(),
        adminNotes: dto.notes,
      },
    });

    await this.createAuditLog(admin.id, AuditAction.UPDATE, 'Withdrawal', id, {
      action: 'APPROVED',
      amount: withdrawal.amountMinor.toString(),
    });

    return result;
  }

  @Post('withdrawals/:id/reject')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.FINANCE_MANAGER)
  @RequireMFA()
  async rejectWithdrawal(
    @Param('id') id: string,
    @CurrentUser() admin: any,
    @Body() dto: { reason: string },
  ) {
    if (!dto.reason) {
      throw new BadRequestException('Rejection reason required');
    }

    const withdrawal = await this.prisma.withdrawal.findUnique({
      where: { id },
    });

    if (!withdrawal) {
      throw new NotFoundException('Withdrawal not found');
    }

    if (withdrawal.status !== WithdrawalStatus.PENDING) {
      throw new BadRequestException(
        `Cannot reject withdrawal in ${withdrawal.status} status`,
      );
    }

    // Return funds to wallet
    const result = await this.prisma.$transaction(async (tx) => {
      // Update wallet
      await tx.wallet.update({
        where: { userId: withdrawal.userId },
        data: {
          lockedMinor: { decrement: withdrawal.amountMinor },
        },
      });

      // Update withdrawal
      return tx.withdrawal.update({
        where: { id },
        data: {
          status: WithdrawalStatus.REJECTED,
          rejectionReason: dto.reason,
        },
      });
    });

    await this.createAuditLog(admin.id, AuditAction.UPDATE, 'Withdrawal', id, {
      action: 'REJECTED',
      reason: dto.reason,
    });

    return result;
  }

  // ============================================================================
  // USER MANAGEMENT
  // ============================================================================

  @Get('users')
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @RequireMFA()
  async getUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('search') search?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: any = { deletedAt: null };

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          email: true,
          phone: true,
          kycStatus: true,
          isAdmin: true,
          suspendedAt: true,
          suspendedUntil: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  @Post('users/:id/suspend')
  @Roles(Role.SUPER_ADMIN)
  @RequireMFA()
  async suspendUser(
    @Param('id') id: string,
    @CurrentUser() admin: any,
    @Body() dto: UserSuspendDto,
  ) {
    if (!dto.reason) {
      throw new BadRequestException('Suspension reason required');
    }

    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Cannot suspend self
    if (id === admin.id) {
      throw new ForbiddenException('Cannot suspend yourself');
    }

    // Cannot suspend other admins (only super admin can)
    if (user.isAdmin) {
      throw new ForbiddenException('Cannot suspend admin users');
    }

    const suspendedUntil = dto.duration
      ? new Date(Date.now() + dto.duration * 60 * 60 * 1000)
      : null;

    const result = await this.prisma.user.update({
      where: { id },
      data: {
        suspendedAt: new Date(),
        suspendedUntil,
        suspendReason: dto.reason,
      },
    });

    await this.createAuditLog(admin.id, AuditAction.UPDATE, 'User', id, {
      action: 'SUSPENDED',
      reason: dto.reason,
      duration: dto.duration,
    });

    return {
      id: result.id,
      message: 'User suspended successfully',
      suspendedUntil,
    };
  }

  @Post('users/:id/unsuspend')
  @Roles(Role.SUPER_ADMIN)
  @RequireMFA()
  async unsuspendUser(
    @Param('id') id: string,
    @CurrentUser() admin: any,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.suspendedAt) {
      throw new BadRequestException('User is not suspended');
    }

    const result = await this.prisma.user.update({
      where: { id },
      data: {
        suspendedAt: null,
        suspendedUntil: null,
        suspendReason: null,
      },
    });

    await this.createAuditLog(admin.id, AuditAction.UPDATE, 'User', id, {
      action: 'UNSUSPENDED',
    });

    return {
      id: result.id,
      message: 'User unsuspended successfully',
    };
  }

  // ============================================================================
  // AUDIT LOGS
  // ============================================================================

  @Get('audit-logs')
  @Roles(Role.SUPER_ADMIN)
  @RequireMFA()
  async getAuditLogs(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
    @Query('userId') userId?: string,
    @Query('action') action?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (userId) where.userId = userId;
    if (action) where.action = action;

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      data: logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private async createAuditLog(
    userId: string,
    action: AuditAction,
    entityType: string,
    entityId: string,
    details: any,
  ) {
    await this.prisma.auditLog.create({
      data: {
        performedBy: userId,
        action,
        entityType,
        entityId,
        details,
      },
    });
  }
}
