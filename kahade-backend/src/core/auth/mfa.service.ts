import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MfaService {
  private readonly logger = new Logger(MfaService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
