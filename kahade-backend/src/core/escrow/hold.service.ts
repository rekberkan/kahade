import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class HoldService {
  private readonly logger = new Logger(HoldService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
