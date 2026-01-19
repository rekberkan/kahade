import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ArbitrationService {
  private readonly logger = new Logger(ArbitrationService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
