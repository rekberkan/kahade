import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AccountNameCheckService {
  private readonly logger = new Logger(AccountNameCheckService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
