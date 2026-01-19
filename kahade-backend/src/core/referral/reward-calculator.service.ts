import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RewardCalculatorService {
  private readonly logger = new Logger(RewardCalculatorService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
