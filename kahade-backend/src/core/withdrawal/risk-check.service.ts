import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RiskCheckService {
  private readonly logger = new Logger(RiskCheckService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
