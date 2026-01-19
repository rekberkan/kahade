import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class FaceMatchService {
  private readonly logger = new Logger(FaceMatchService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
