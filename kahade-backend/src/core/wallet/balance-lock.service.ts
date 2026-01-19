import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class BalanceLockService {
  private readonly logger = new Logger(BalanceLockService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
