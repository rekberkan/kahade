import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ProofService {
  private readonly logger = new Logger(ProofService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
