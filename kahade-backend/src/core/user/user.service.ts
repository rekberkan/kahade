import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UserRepository, ICreateUser, IUpdateUser } from './user.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationUtil, PaginationParams } from '@common/utils/pagination.util';
import { IUserResponse, KYCStatus } from '@common/interfaces/user.interface';
import { User } from '@prisma/client';

// ============================================================================
// BANK-GRADE USER SERVICE
// Implements: Password Management, Account Status, Security Features
// ============================================================================

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserData: ICreateUser): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(createUserData.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const existingUsername = await this.userRepository.findByUsername(createUserData.username);
    if (existingUsername) {
      throw new BadRequestException('Username already exists');
    }

    return this.userRepository.create(createUserData);
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findByUsername(username);
  }

  async findAll(params: PaginationParams) {
    const { page = 1, limit = 10 } = params;
    const skip = PaginationUtil.getSkip(page, limit);

    const { users, total } = await this.userRepository.findAll(skip, limit);

    const sanitizedUsers = users.map((user) => this.sanitizeUser(user));

    return PaginationUtil.paginate(sanitizedUsers, total, page, limit);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<IUserResponse> {
    const user = await this.findById(id);

    const updateData: IUpdateUser = {
      username: updateUserDto.username,
      phone: updateUserDto.phone,
    };

    const updated = await this.userRepository.update(id, updateData);
    return this.sanitizeUser(updated);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userRepository.update(id, {
      lastLoginAt: new Date(),
    });
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.userRepository.delete(id);
  }

  // ============================================================================
  // PASSWORD MANAGEMENT
  // ============================================================================

  /**
   * BANK-GRADE: Update user password
   */
  async updatePassword(userId: string, newPasswordHash: string): Promise<void> {
    await this.userRepository.update(userId, {
      passwordHash: newPasswordHash,
      passwordUpdatedAt: new Date(),
    });
  }

  /**
   * BANK-GRADE: Set password reset token
   */
  async setPasswordResetToken(
    userId: string,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.userRepository.update(userId, {
      passwordResetToken: tokenHash,
      passwordResetExpires: expiresAt,
    });
  }

  /**
   * BANK-GRADE: Find user by password reset token
   */
  async findByPasswordResetToken(tokenHash: string): Promise<User | null> {
    return this.userRepository.findByPasswordResetToken(tokenHash);
  }

  /**
   * BANK-GRADE: Clear password reset token
   */
  async clearPasswordResetToken(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      passwordResetToken: null,
      passwordResetExpires: null,
    });
  }

  // ============================================================================
  // ACCOUNT STATUS MANAGEMENT
  // ============================================================================

  /**
   * BANK-GRADE: Suspend user account
   */
  async suspendUser(
    userId: string,
    reason: string,
    suspendedUntil?: Date,
  ): Promise<void> {
    await this.userRepository.update(userId, {
      suspendedAt: new Date(),
      suspendedUntil: suspendedUntil || null,
      suspendReason: reason,
    });
  }

  /**
   * BANK-GRADE: Unsuspend user account
   */
  async unsuspendUser(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      suspendedAt: null,
      suspendedUntil: null,
      suspendReason: null,
    });
  }

  /**
   * BANK-GRADE: Check if user is suspended
   */
  async isUserSuspended(userId: string): Promise<boolean> {
    const user = await this.findById(userId);
    if (!user.suspendedAt) {
      return false;
    }
    
    // Check if suspension has expired
    if (user.suspendedUntil && new Date(user.suspendedUntil) < new Date()) {
      // Auto-unsuspend
      await this.unsuspendUser(userId);
      return false;
    }
    
    return true;
  }

  // ============================================================================
  // FAILED LOGIN TRACKING
  // ============================================================================

  /**
   * BANK-GRADE: Increment failed login count
   */
  async incrementFailedLogin(userId: string): Promise<number> {
    const user = await this.findById(userId);
    const newCount = (user.failedLoginCount || 0) + 1;
    
    await this.userRepository.update(userId, {
      failedLoginCount: newCount,
      lastFailedLoginAt: new Date(),
    });
    
    return newCount;
  }

  /**
   * BANK-GRADE: Reset failed login count
   */
  async resetFailedLogin(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      failedLoginCount: 0,
      lastFailedLoginAt: null,
    });
  }

  // ============================================================================
  // UTILITY
  // ============================================================================

  sanitizeUser(user: any): IUserResponse {
    const { passwordHash, passwordResetToken, passwordResetExpires, totpSecretEnc, backupCodesHash, ...sanitized } = user;
    return {
      ...sanitized,
      kycStatus: user.kycStatus as KYCStatus,
    } as IUserResponse;
  }
}
