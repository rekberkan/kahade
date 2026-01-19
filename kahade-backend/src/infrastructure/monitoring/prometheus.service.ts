import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PrometheusService {
  private readonly logger = new Logger(PrometheusService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
