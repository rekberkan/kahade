import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TransactionLimitService {
  private readonly logger = new Logger(TransactionLimitService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
