import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RefundService {
  private readonly logger = new Logger(RefundService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
