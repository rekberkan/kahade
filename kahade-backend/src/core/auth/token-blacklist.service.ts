import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class TokenBlacklistService {
  private readonly logger = new Logger(TokenBlacklistService.name);
  private redis: Redis | null = null;
  private blacklistSet = new Set<string>();
  private refreshTokens = new Map<string, { userId: string; expiresAt: number }>();

  constructor(private readonly configService: ConfigService) {
    const redisHost = this.configService.get<string>('redis.host');
    const redisPort = this.configService.get<number>('redis.port');
    
    if (redisHost && redisPort) {
      this.redis = new Redis({
        host: redisHost,
        port: redisPort,
        password: this.configService.get<string>('redis.password'),
        db: this.configService.get<number>('redis.db', 0),
        lazyConnect: true,
      });

      this.redis.on('error', (err) => {
        this.logger.warn(`Redis connection failed: ${err.message}. Falling back to memory storage.`);
        this.redis = null;
      });
    }
  }

  async isBlacklisted(token: string): Promise<boolean> {
    if (this.redis) {
      const result = await this.redis.get(`blacklist:${token}`);
      return result === 'true';
    }
    return this.blacklistSet.has(token);
  }

  async blacklistToken(token: string, expiresInSeconds: number): Promise<void> {
    if (this.redis) {
      await this.redis.set(`blacklist:${token}`, 'true', 'EX', expiresInSeconds);
    } else {
      this.blacklistSet.add(token);
      setTimeout(() => this.blacklistSet.delete(token), expiresInSeconds * 1000);
    }
  }

  async storeRefreshToken(userId: string, token: string, expiresInSeconds: number): Promise<void> {
    if (this.redis) {
      await this.redis.set(`refresh:${token}`, userId, 'EX', expiresInSeconds);
    } else {
      this.refreshTokens.set(token, {
        userId,
        expiresAt: Date.now() + (expiresInSeconds * 1000),
      });
    }
  }

  async validateRefreshToken(token: string): Promise<string | null> {
    if (this.redis) {
      const userId = await this.redis.get(`refresh:${token}`);
      return userId ?? null;
    } else {
      const data = this.refreshTokens.get(token);
      if (data && data.expiresAt > Date.now()) {
        return data.userId;
      }
    }
    return null;
  }

  async revokeRefreshToken(token: string): Promise<void> {
    if (this.redis) {
      await this.redis.del(`refresh:${token}`);
    } else {
      this.refreshTokens.delete(token);
    }
  }
}
