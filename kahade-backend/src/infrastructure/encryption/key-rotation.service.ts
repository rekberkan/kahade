import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class KeyRotationService {
  private readonly logger = new Logger(KeyRotationService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
