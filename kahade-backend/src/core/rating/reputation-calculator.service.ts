import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ReputationCalculatorService {
  private readonly logger = new Logger(ReputationCalculatorService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
