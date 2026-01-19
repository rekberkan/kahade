import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class InvoiceService {
  private readonly logger = new Logger(InvoiceService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
