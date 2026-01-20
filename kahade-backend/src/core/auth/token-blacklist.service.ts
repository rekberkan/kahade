import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenBlacklistService {
  private blacklistSet = new Set<string>();
  private refreshTokens = new Map<string, { token: string; expiresAt: number }>();

  async isBlacklisted(token: string): Promise<boolean> {
    return this.blacklistSet.has(token);
  }

  async blacklistToken(token: string, expiresInSeconds: number): Promise<void> {
    this.blacklistSet.add(token);
    setTimeout(() => this.blacklistSet.delete(token), expiresInSeconds * 1000);
  }

  async storeRefreshToken(userId: string, token: string, expiresInSeconds: number): Promise<void> {
    this.refreshTokens.set(userId, {
      token,
      expiresAt: Date.now() + (expiresInSeconds * 1000)
    });
  }

  async validateRefreshToken(token: string): Promise<string | null> {
    for (const [userId, data] of this.refreshTokens.entries()) {
      if (data.token === token && data.expiresAt > Date.now()) {
        return userId;
      }
    }
    return null;
  }

  async revokeRefreshToken(token: string): Promise<void> {
    for (const [userId, data] of this.refreshTokens.entries()) {
      if (data.token === token) {
        this.refreshTokens.delete(userId);
        break;
      }
    }
  }
}
