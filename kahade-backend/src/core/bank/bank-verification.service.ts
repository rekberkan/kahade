import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class BankVerificationService {
  private readonly logger = new Logger(BankVerificationService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
