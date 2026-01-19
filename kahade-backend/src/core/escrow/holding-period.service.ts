import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class HoldingPeriodService {
  private readonly logger = new Logger(HoldingPeriodService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
