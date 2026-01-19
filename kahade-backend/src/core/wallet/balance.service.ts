import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class BalanceService {
  private readonly logger = new Logger(BalanceService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
