import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class FlipService {
  private readonly logger = new Logger(FlipService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
