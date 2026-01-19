import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
