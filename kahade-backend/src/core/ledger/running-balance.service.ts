import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RunningBalanceService {
  private readonly logger = new Logger(RunningBalanceService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
