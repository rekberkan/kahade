import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LedgerService {
  private readonly logger = new Logger(LedgerService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
