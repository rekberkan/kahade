import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class BullService {
  private readonly logger = new Logger(BullService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
