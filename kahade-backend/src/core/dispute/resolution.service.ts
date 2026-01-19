import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ResolutionService {
  private readonly logger = new Logger(ResolutionService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
