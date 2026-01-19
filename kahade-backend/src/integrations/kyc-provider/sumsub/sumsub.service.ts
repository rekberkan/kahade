import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SumsubService {
  private readonly logger = new Logger(SumsubService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
