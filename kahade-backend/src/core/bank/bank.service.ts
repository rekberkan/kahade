import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class BankService {
  private readonly logger = new Logger(BankService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
