import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ComplianceService {
  private readonly logger = new Logger(ComplianceService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
