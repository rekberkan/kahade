import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TimelineService {
  private readonly logger = new Logger(TimelineService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
