import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ReputationService {
  private readonly logger = new Logger(ReputationService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
