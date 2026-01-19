import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ReferralService {
  private readonly logger = new Logger(ReferralService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
