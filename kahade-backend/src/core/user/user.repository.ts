import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { User } from '@prisma/client';

// ============================================================================
// BANK-GRADE USER REPOSITORY
// Implements: Password Management, Account Status, Security Features
// ============================================================================

export interface ICreateUser {
  email: string;
  passwordHash: string;
  username: string;
  phone?: string;
  isAdmin?: boolean;
}

export interface IUpdateUser {
  username?: string;
  phone?: string;
  emailVerifiedAt?: Date;
  lastLoginAt?: Date;
  failedLoginCount?: number;
  lockedUntil?: Date;
  // Password management
  passwordHash?: string;
  passwordUpdatedAt?: Date;
  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;
  // Account status
  suspendedAt?: Date | null;
  suspendedUntil?: Date | null;
  suspendReason?: string | null;
  // Failed login tracking
  lastFailedLoginAt?: Date | null;
}

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: ICreateUser): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...data,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  /**
   * BANK-GRADE: Find user by password reset token
   */
  async findByPasswordResetToken(tokenHash: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        passwordResetToken: tokenHash,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    });
  }

  async findAll(skip: number, take: number): Promise<{ users: User[]; total: number }> {
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return { users, total };
  }

  async update(id: string, data: IUpdateUser): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async count(): Promise<number> {
    return this.prisma.user.count();
  }

  /**
   * BANK-GRADE: Find users with active suspensions
   */
  async findSuspendedUsers(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        suspendedAt: { not: null },
        OR: [
          { suspendedUntil: null },
          { suspendedUntil: { gt: new Date() } },
        ],
      },
    });
  }

  /**
   * BANK-GRADE: Find users with expired password reset tokens (for cleanup)
   */
  async findUsersWithExpiredResetTokens(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        passwordResetToken: { not: null },
        passwordResetExpires: { lt: new Date() },
      },
    });
  }

  /**
   * BANK-GRADE: Bulk clear expired password reset tokens
   */
  async clearExpiredResetTokens(): Promise<number> {
    const result = await this.prisma.user.updateMany({
      where: {
        passwordResetToken: { not: null },
        passwordResetExpires: { lt: new Date() },
      },
      data: {
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });
    return result.count;
  }
}
