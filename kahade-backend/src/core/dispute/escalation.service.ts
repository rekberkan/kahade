import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EscalationService {
  private readonly logger = new Logger(EscalationService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
