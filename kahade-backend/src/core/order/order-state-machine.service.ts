import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class OrderStateMachineService {
  private readonly logger = new Logger(OrderStateMachineService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
