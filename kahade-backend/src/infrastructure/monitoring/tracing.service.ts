import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TracingService {
  private readonly logger = new Logger(TracingService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
