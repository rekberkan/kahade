import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class InviteTokenService {
  private readonly logger = new Logger(InviteTokenService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
