import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EntryService {
  private readonly logger = new Logger(EntryService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
