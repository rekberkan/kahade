import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RatingService {
  private readonly logger = new Logger(RatingService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
