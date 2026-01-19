import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class KeyManagementService {
  private readonly logger = new Logger(KeyManagementService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
