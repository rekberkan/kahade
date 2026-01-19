import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class OcrService {
  private readonly logger = new Logger(OcrService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
