import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class JackService {
  private readonly logger = new Logger(JackService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
