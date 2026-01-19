import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
