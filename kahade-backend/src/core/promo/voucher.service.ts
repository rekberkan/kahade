import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class VoucherService {
  private readonly logger = new Logger(VoucherService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
