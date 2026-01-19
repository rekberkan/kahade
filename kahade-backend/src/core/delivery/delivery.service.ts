import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DeliveryService {
  private readonly logger = new Logger(DeliveryService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
