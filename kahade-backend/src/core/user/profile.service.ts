import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
