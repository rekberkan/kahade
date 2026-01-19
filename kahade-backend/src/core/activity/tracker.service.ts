import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TrackerService {
  private readonly logger = new Logger(TrackerService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
