import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DisputeManagementService {
  private readonly logger = new Logger(DisputeManagementService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
