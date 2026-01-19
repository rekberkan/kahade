import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UsageService {
  private readonly logger = new Logger(UsageService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
