import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class XenditService {
  private readonly logger = new Logger(XenditService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
