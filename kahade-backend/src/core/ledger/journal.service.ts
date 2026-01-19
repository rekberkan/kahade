import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class JournalService {
  private readonly logger = new Logger(JournalService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
