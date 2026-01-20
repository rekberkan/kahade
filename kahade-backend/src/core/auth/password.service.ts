import { Injectable, BadRequestException } from '@nestjs/common';
import { HashUtil } from '@common/utils/crypto.util';
import * as zxcvbn from 'zxcvbn';

export interface IPasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  minStrengthScore: number; // 0-4 (zxcvbn score)
  rotationDays: number;      // Days until password must be changed
  preventReuse: number;      // Number of previous passwords to check
}

const DEFAULT_POLICY: IPasswordPolicy = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  minStrengthScore: 3,
  rotationDays: 90,
  preventReuse: 5,
};

@Injectable()
export class PasswordService {
  private readonly policy: IPasswordPolicy = DEFAULT_POLICY;

  /**
   * Validate password against policy
   */
  validatePassword(password: string, userInputs: string[] = []): {
    valid: boolean;
    errors: string[];
    score: number;
  } {
    const errors: string[] = [];

    // Length check
    if (password.length < this.policy.minLength) {
      errors.push(`Password must be at least ${this.policy.minLength} characters`);
    }

    // Uppercase check
    if (this.policy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    // Lowercase check
    if (this.policy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    // Numbers check
    if (this.policy.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    // Special characters check
    if (this.policy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    // Strength check using zxcvbn
    const strengthResult = zxcvbn(password, userInputs);

    if (strengthResult.score < this.policy.minStrengthScore) {
      errors.push(
        `Password is too weak. ${strengthResult.feedback.warning || 'Use a stronger password'}`,
      );
      if (strengthResult.feedback.suggestions.length > 0) {
        errors.push(...strengthResult.feedback.suggestions);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      score: strengthResult.score,
    };
  }

  /**
   * Check if password needs rotation
   */
  needsRotation(passwordUpdatedAt: Date | null): boolean {
    if (!passwordUpdatedAt) return true;

    const daysSinceUpdate =
      (Date.now() - passwordUpdatedAt.getTime()) / (1000 * 60 * 60 * 24);

    return daysSinceUpdate >= this.policy.rotationDays;
  }

  /**
   * Check if password was used recently
   */
  async checkPasswordReuse(
    newPassword: string,
    previousPasswordHashes: string[],
  ): Promise<boolean> {
    const recentHashes = previousPasswordHashes.slice(
      -this.policy.preventReuse,
    );

    for (const hash of recentHashes) {
      const isReused = await HashUtil.compare(newPassword, hash);
      if (isReused) {
        return true; // Password was recently used
      }
    }

    return false; // Password not recently used
  }

  /**
   * Generate secure random password
   */
  generateSecurePassword(length = 16): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const all = uppercase + lowercase + numbers + special;

    let password = '';

    // Ensure at least one of each required type
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];

    // Fill remaining length
    for (let i = password.length; i < length; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }

    // Shuffle password
    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }
}