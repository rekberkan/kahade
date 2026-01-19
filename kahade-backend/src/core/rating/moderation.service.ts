import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ModerationService {
  private readonly logger = new Logger(ModerationService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
