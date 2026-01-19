import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EvidenceService {
  private readonly logger = new Logger(EvidenceService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
