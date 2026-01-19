import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ReleaseService {
  private readonly logger = new Logger(ReleaseService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
