import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { Prisma } from '@prisma/client';

export interface IWithdrawalLimitCheck {
  canWithdraw: boolean;
  reason?: string;
  dailyUsed: bigint;
  dailyLimit: bigint;
  dailyRemaining: bigint;
  monthlyUsed: bigint;
  monthlyLimit: bigint;
  monthlyRemaining: bigint;
  lastWithdrawalAt: Date | null;
  coolingPeriodMinutes: number;
  minutesSinceLastWithdrawal: number | null;
  velocityScore: number;
  isFlagged: boolean;
}

@Injectable()
export class WithdrawalGuardService {
  private readonly logger = new Logger(WithdrawalGuardService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Check if user can withdraw the requested amount
   * 
   * Validates:
   * - Daily limit
   * - Monthly limit
   * - Cooling period
   * - Velocity score
   * - Account flags
   */
  async checkWithdrawalLimits(
    userId: string,
    amountMinor: bigint,
  ): Promise<IWithdrawalLimitCheck> {
    // Get or create transaction limit
    let limit = await this.prisma.transactionLimit.findUnique({
      where: { userId },
    });

    if (!limit) {
      // Create default limits
      limit = await this.prisma.transactionLimit.create({
        data: {
          userId,
          dailyLimitMinor: BigInt(50_000_000 * 100), // 50M IDR
          monthlyLimitMinor: BigInt(500_000_000 * 100), // 500M IDR
          coolingPeriodMinutes: 60,
          currentPeriodStart: new Date(),
          monthStart: this.getMonthStart(),
        },
      });
    }

    // Reset period if needed
    if (new Date() >= limit.nextReset) {
      await this.resetDailyLimit(userId);
      limit = await this.prisma.transactionLimit.findUnique({
        where: { userId },
      })!;
    }

    // Reset monthly if needed
    const currentMonthStart = this.getMonthStart();
    if (limit.monthStart < currentMonthStart) {
      await this.resetMonthlyLimit(userId);
      limit = await this.prisma.transactionLimit.findUnique({
        where: { userId },
      })!;
    }

    // Calculate remaining limits
    const dailyRemaining = limit.dailyLimitMinor - limit.dailyUsedMinor;
    const monthlyRemaining = limit.monthlyLimitMinor - limit.monthlyUsedMinor;

    // Check daily limit
    if (limit.dailyUsedMinor + amountMinor > limit.dailyLimitMinor) {
      return {
        canWithdraw: false,
        reason: `Daily withdrawal limit exceeded. Remaining: ${this.formatAmount(dailyRemaining)}`,
        dailyUsed: limit.dailyUsedMinor,
        dailyLimit: limit.dailyLimitMinor,
        dailyRemaining,
        monthlyUsed: limit.monthlyUsedMinor,
        monthlyLimit: limit.monthlyLimitMinor,
        monthlyRemaining,
        lastWithdrawalAt: limit.lastWithdrawalAt,
        coolingPeriodMinutes: limit.coolingPeriodMinutes,
        minutesSinceLastWithdrawal: this.getMinutesSince(limit.lastWithdrawalAt),
        velocityScore: limit.velocityScore,
        isFlagged: limit.isFlagged,
      };
    }

    // Check monthly limit
    if (limit.monthlyUsedMinor + amountMinor > limit.monthlyLimitMinor) {
      return {
        canWithdraw: false,
        reason: `Monthly withdrawal limit exceeded. Remaining: ${this.formatAmount(monthlyRemaining)}`,
        dailyUsed: limit.dailyUsedMinor,
        dailyLimit: limit.dailyLimitMinor,
        dailyRemaining,
        monthlyUsed: limit.monthlyUsedMinor,
        monthlyLimit: limit.monthlyLimitMinor,
        monthlyRemaining,
        lastWithdrawalAt: limit.lastWithdrawalAt,
        coolingPeriodMinutes: limit.coolingPeriodMinutes,
        minutesSinceLastWithdrawal: this.getMinutesSince(limit.lastWithdrawalAt),
        velocityScore: limit.velocityScore,
        isFlagged: limit.isFlagged,
      };
    }

    // Check cooling period
    if (limit.lastWithdrawalAt) {
      const minutesSince = this.getMinutesSince(limit.lastWithdrawalAt);
      if (minutesSince !== null && minutesSince < limit.coolingPeriodMinutes) {
        const minutesRemaining = limit.coolingPeriodMinutes - minutesSince;
        return {
          canWithdraw: false,
          reason: `Cooling period active. Please wait ${minutesRemaining} minutes.`,
          dailyUsed: limit.dailyUsedMinor,
          dailyLimit: limit.dailyLimitMinor,
          dailyRemaining,
          monthlyUsed: limit.monthlyUsedMinor,
          monthlyLimit: limit.monthlyLimitMinor,
          monthlyRemaining,
          lastWithdrawalAt: limit.lastWithdrawalAt,
          coolingPeriodMinutes: limit.coolingPeriodMinutes,
          minutesSinceLastWithdrawal: minutesSince,
          velocityScore: limit.velocityScore,
          isFlagged: limit.isFlagged,
        };
      }
    }

    // Check if flagged
    if (limit.isFlagged) {
      this.logger.warn(
        `User ${userId} is flagged for suspicious activity (score: ${limit.velocityScore})`,
      );
      // Don't block, but log for manual review
    }

    return {
      canWithdraw: true,
      dailyUsed: limit.dailyUsedMinor,
      dailyLimit: limit.dailyLimitMinor,
      dailyRemaining,
      monthlyUsed: limit.monthlyUsedMinor,
      monthlyLimit: limit.monthlyLimitMinor,
      monthlyRemaining,
      lastWithdrawalAt: limit.lastWithdrawalAt,
      coolingPeriodMinutes: limit.coolingPeriodMinutes,
      minutesSinceLastWithdrawal: this.getMinutesSince(limit.lastWithdrawalAt),
      velocityScore: limit.velocityScore,
      isFlagged: limit.isFlagged,
    };
  }

  /**
   * Record withdrawal and update limits
   */
  async recordWithdrawal(
    userId: string,
    amountMinor: bigint,
    ipAddress: string,
    deviceFingerprint?: string,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // Update transaction limit
      await tx.transactionLimit.update({
        where: { userId },
        data: {
          dailyUsedMinor: { increment: amountMinor },
          monthlyUsedMinor: { increment: amountMinor },
          lastWithdrawalAt: new Date(),
        },
      });

      // Log velocity
      await tx.withdrawalVelocityLog.create({
        data: {
          userId,
          amountMinor,
          ipAddress,
          deviceFingerprint,
          timestamp: new Date(),
        },
      });

      // Calculate velocity score
      await this.updateVelocityScore(userId, tx);
    });
  }

  /**
   * Update velocity score based on recent withdrawal patterns
   */
  private async updateVelocityScore(
    userId: string,
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    const now = new Date();
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [hourly, daily, weekly] = await Promise.all([
      tx.withdrawalVelocityLog.count({
        where: { userId, timestamp: { gte: hourAgo } },
      }),
      tx.withdrawalVelocityLog.count({
        where: { userId, timestamp: { gte: dayAgo } },
      }),
      tx.withdrawalVelocityLog.count({
        where: { userId, timestamp: { gte: weekAgo } },
      }),
    ]);

    // Calculate risk score (0-100)
    let score = 0;

    // Hourly velocity (high risk)
    if (hourly >= 3) score += 40;
    else if (hourly >= 2) score += 20;

    // Daily velocity (medium risk)
    if (daily >= 10) score += 30;
    else if (daily >= 5) score += 15;

    // Weekly velocity (low risk)
    if (weekly >= 30) score += 30;
    else if (weekly >= 20) score += 15;

    // Update transaction limit
    await tx.transactionLimit.update({
      where: { userId },
      data: {
        velocityScore: score,
        isFlagged: score >= 75, // Auto-flag if score >= 75
      },
    });

    if (score >= 75) {
      this.logger.warn(
        `User ${userId} flagged for suspicious withdrawal velocity (score: ${score})`,
      );
    }
  }

  private async resetDailyLimit(userId: string): Promise<void> {
    await this.prisma.transactionLimit.update({
      where: { userId },
      data: {
        dailyUsedMinor: BigInt(0),
        currentPeriodStart: new Date(),
        nextReset: this.getNextReset(),
      },
    });
  }

  private async resetMonthlyLimit(userId: string): Promise<void> {
    await this.prisma.transactionLimit.update({
      where: { userId },
      data: {
        monthlyUsedMinor: BigInt(0),
        monthStart: this.getMonthStart(),
      },
    });
  }

  private getNextReset(): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  }

  private getMonthStart(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }

  private getMinutesSince(date: Date | null): number | null {
    if (!date) return null;
    return Math.floor((Date.now() - date.getTime()) / 60000);
  }

  private formatAmount(amountMinor: bigint): string {
    const amount = Number(amountMinor) / 100;
    return `Rp ${amount.toLocaleString('id-ID')}`;
  }
}