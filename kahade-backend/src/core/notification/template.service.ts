import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
