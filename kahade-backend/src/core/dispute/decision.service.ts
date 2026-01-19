import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DecisionService {
  private readonly logger = new Logger(DecisionService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
