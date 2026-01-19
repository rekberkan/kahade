import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CacheManagerService {
  private readonly logger = new Logger(CacheManagerService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
