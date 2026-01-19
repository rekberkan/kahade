import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EncryptionService {
  private readonly logger = new Logger(EncryptionService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
