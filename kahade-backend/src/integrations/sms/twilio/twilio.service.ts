import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TwilioService {
  private readonly logger = new Logger(TwilioService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
