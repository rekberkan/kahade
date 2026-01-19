import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AutoReleaseService {
  private readonly logger = new Logger(AutoReleaseService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
