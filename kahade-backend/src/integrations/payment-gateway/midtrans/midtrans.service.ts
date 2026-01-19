import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MidtransService {
  private readonly logger = new Logger(MidtransService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
