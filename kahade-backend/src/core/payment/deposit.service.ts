import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DepositService {
  private readonly logger = new Logger(DepositService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
