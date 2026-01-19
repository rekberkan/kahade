import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class OnfidoService {
  private readonly logger = new Logger(OnfidoService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
