import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WithdrawalManagementService {
  private readonly logger = new Logger(WithdrawalManagementService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
