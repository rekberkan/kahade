import { Injectable, Logger } from '@nestjs/common';
import { CacheService } from '@infrastructure/cache/cache.service';

@Injectable()
export class TokenBlacklistService {
  private readonly logger = new Logger(TokenBlacklistService.name);
  private readonly BLACKLIST_PREFIX = 'token:blacklist:';
  private readonly REFRESH_TOKEN_PREFIX = 'token:refresh:';

  constructor(private readonly cacheService: CacheService) {}

  /**
   * Blacklist an access token until it expires
   */
  async blacklistToken(token: string, expiresInSeconds: number): Promise<void> {
    const key = this.BLACKLIST_PREFIX + token;
    await this.cacheService.set(key, 'blacklisted', expiresInSeconds);
    this.logger.log(`Token blacklisted for ${expiresInSeconds} seconds`);
  }

  /**
   * Check if a token is blacklisted
   */
  async isTokenBlacklisted(token: string): Promise<boolean> {
    const key = this.BLACKLIST_PREFIX + token;
    const result = await this.cacheService.get(key);
    return result === 'blacklisted';
  }

  /**
   * Store refresh token with userId for tracking
   */
  async storeRefreshToken(
    userId: string,
    refreshToken: string,
    expiresInSeconds: number,
  ): Promise<void> {
    const key = this.REFRESH_TOKEN_PREFIX + refreshToken;
    await this.cacheService.set(key, userId, expiresInSeconds);
    this.logger.log(`Refresh token stored for user: ${userId}`);
  }

  /**
   * Validate refresh token exists and get userId
   */
  async validateRefreshToken(refreshToken: string): Promise<string | null> {
    const key = this.REFRESH_TOKEN_PREFIX + refreshToken;
    const userId = await this.cacheService.get<string>(key);
    return userId || null;
  }

  /**
   * Revoke refresh token
   */
  async revokeRefreshToken(refreshToken: string): Promise<void> {
    const key = this.REFRESH_TOKEN_PREFIX + refreshToken;
    await this.cacheService.del(key);
    this.logger.log('Refresh token revoked');
  }

  /**
   * Revoke all tokens for a user (e.g., on logout all devices)
   */
  async revokeAllUserTokens(userId: string): Promise<void> {
    // This would require scanning Redis keys by pattern
    // For now, log the action - implement full scan if needed
    this.logger.warn(`Revoke all tokens for user ${userId} - implement full scan if needed`);
  }
}
