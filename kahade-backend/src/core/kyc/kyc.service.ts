import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class KycService {
  private readonly logger = new Logger(KycService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
