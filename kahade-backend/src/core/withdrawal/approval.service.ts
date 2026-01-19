import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ApprovalService {
  private readonly logger = new Logger(ApprovalService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
