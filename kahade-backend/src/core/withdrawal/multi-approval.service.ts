import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MultiApprovalService {
  private readonly logger = new Logger(MultiApprovalService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
