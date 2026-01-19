import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailgunService {
  private readonly logger = new Logger(MailgunService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
