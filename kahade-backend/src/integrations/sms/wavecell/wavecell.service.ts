import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WavecellService {
  private readonly logger = new Logger(WavecellService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
