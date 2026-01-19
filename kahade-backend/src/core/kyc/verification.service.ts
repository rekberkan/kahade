import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
