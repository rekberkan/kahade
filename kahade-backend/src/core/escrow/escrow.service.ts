import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EscrowService {
  private readonly logger = new Logger(EscrowService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
