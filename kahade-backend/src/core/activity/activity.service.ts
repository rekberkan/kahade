import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ActivityService {
  private readonly logger = new Logger(ActivityService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
