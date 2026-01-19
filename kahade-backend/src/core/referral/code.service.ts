import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CodeService {
  private readonly logger = new Logger(CodeService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
