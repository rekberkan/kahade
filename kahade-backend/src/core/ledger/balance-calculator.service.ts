import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class BalanceCalculatorService {
  private readonly logger = new Logger(BalanceCalculatorService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
