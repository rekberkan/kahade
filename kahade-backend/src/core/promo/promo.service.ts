import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PromoService {
  private readonly logger = new Logger(PromoService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
