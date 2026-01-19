import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DoubleEntryService {
  private readonly logger = new Logger(DoubleEntryService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
