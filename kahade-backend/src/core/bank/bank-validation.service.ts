import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class BankValidationService {
  private readonly logger = new Logger(BankValidationService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
