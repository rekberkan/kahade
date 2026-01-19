import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
