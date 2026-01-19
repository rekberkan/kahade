import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SentryService {
  private readonly logger = new Logger(SentryService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
