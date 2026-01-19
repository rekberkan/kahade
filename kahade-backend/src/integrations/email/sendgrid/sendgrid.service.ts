import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SendgridService {
  private readonly logger = new Logger(SendgridService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
