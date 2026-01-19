import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class QueryLoggerService {
  private readonly logger = new Logger(QueryLoggerService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
