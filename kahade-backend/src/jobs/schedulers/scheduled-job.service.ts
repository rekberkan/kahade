import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ScheduledJobService {
  private readonly logger = new Logger(ScheduledJobService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
