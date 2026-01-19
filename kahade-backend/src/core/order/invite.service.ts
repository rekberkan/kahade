import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class InviteService {
  private readonly logger = new Logger(InviteService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
