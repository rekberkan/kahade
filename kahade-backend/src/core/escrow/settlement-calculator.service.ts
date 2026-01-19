import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SettlementCalculatorService {
  private readonly logger = new Logger(SettlementCalculatorService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
