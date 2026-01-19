import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PiiMaskingService {
  private readonly logger = new Logger(PiiMaskingService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
