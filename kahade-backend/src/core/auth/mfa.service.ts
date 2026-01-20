import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { CryptoUtil } from '@common/utils/crypto.util';
import { HashUtil } from '@common/utils/hash.util';

export interface IMFASetup {
  secret: string;           // Encrypted secret to store in DB
  qrCodeDataURL: string;    // QR code for user to scan
  backupCodes: string[];    // Hashed backup codes
  backupCodesPlain: string[]; // Plain backup codes (show once)
}

@Injectable()
export class MFAService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Generate MFA secret and QR code for user setup
   */
  async setupMFA(userId: string, userEmail: string): Promise<IMFASetup> {
    const appName = this.configService.get<string>('app.name', 'Kahade');

    // Generate TOTP secret
    const secret = speakeasy.generateSecret({
      name: `${appName} (${userEmail})`,
      length: 32,
    });

    // Generate QR code
    const qrCodeDataURL = await QRCode.toDataURL(secret.otpauth_url || '');

    // Generate 10 backup codes
    const backupCodesPlain = Array.from({ length: 10 }, () =>
      this.generateBackupCode(),
    );

    // Hash backup codes for storage
    const backupCodesHashed = await Promise.all(
      backupCodesPlain.map((code) => HashUtil.hash(code)),
    );

    // Encrypt secret for storage
    const encryptedSecret = await CryptoUtil.encrypt(secret.base32);

    return {
      secret: encryptedSecret,
      qrCodeDataURL,
      backupCodes: backupCodesHashed,
      backupCodesPlain,
    };
  }

  /**
   * Verify TOTP token
   */
  async verifyTOTP(
    encryptedSecret: string,
    token: string,
    window = 1,
  ): Promise<boolean> {
    try {
      // Decrypt secret
      const secret = await CryptoUtil.decrypt(encryptedSecret);

      // Verify token
      const verified = speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token,
        window, // Allow 1 step before/after (30 seconds)
      });

      return verified;
    } catch (error) {
      return false;
    }
  }

  /**
   * Verify backup code
   */
  async verifyBackupCode(
    backupCodesHashed: string[],
    providedCode: string,
  ): Promise<{ valid: boolean; codeIndex?: number }> {
    for (let i = 0; i < backupCodesHashed.length; i++) {
      const isValid = await HashUtil.compare(providedCode, backupCodesHashed[i]);
      if (isValid) {
        return { valid: true, codeIndex: i };
      }
    }

    return { valid: false };
  }

  /**
   * Generate secure backup code (8 chars: XXXX-XXXX)
   */
  private generateBackupCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';

    for (let i = 0; i < 8; i++) {
      if (i === 4) code += '-'; // Add hyphen in the middle
      const randomIndex = Math.floor(Math.random() * chars.length);
      code += chars[randomIndex];
    }

    return code;
  }

  /**
   * Regenerate backup codes
   */
  async regenerateBackupCodes(): Promise<{
    backupCodes: string[];
    backupCodesPlain: string[];
  }> {
    const backupCodesPlain = Array.from({ length: 10 }, () =>
      this.generateBackupCode(),
    );

    const backupCodesHashed = await Promise.all(
      backupCodesPlain.map((code) => HashUtil.hash(code)),
    );

    return {
      backupCodes: backupCodesHashed,
      backupCodesPlain,
    };
  }
}