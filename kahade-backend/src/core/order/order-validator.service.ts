import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class OrderValidatorService {
  private readonly logger = new Logger(OrderValidatorService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
