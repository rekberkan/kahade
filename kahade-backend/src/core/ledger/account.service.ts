import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
