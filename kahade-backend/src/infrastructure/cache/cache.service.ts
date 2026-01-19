import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService {
  private redisClient: Redis;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    // Access the underlying Redis client
    const store = (this.cacheManager as any).store;
    if (store && store.getClient) {
      this.redisClient = store.getClient();
    }
  }

  async get<T>(key: string): Promise<T | undefined> {
    return await this.cacheManager.get<T>(key);
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async reset(): Promise<void> {
    await this.cacheManager.reset();
  }

  async wrap<T>(key: string, fn: () => Promise<T>, ttl?: number): Promise<T> {
    return await this.cacheManager.wrap(key, fn, ttl);
  }

  /**
   * Ping Redis to check connection
   */
  async ping(): Promise<string> {
    try {
      if (this.redisClient && this.redisClient.ping) {
        return await this.redisClient.ping();
      }
      // Fallback: try to get/set a test key
      await this.set('health-check', 'ok', 5);
      const result = await this.get('health-check');
      await this.del('health-check');
      return result === 'ok' ? 'PONG' : 'ERROR';
    } catch (error) {
      throw new Error(`Redis ping failed: ${error.message}`);
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<any> {
    try {
      if (this.redisClient && this.redisClient.info) {
        const info = await this.redisClient.info('stats');
        return { info };
      }
      return { status: 'Redis client not available' };
    } catch (error) {
      return { error: error.message };
    }
  }
}
