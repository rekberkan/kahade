import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DisbursementService {
  private readonly logger = new Logger(DisbursementService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
