import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SettlementService {
  private readonly logger = new Logger(SettlementService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
