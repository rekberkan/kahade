import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ReconciliationService {
  private readonly logger = new Logger(ReconciliationService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
