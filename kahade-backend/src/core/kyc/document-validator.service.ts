import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DocumentValidatorService {
  private readonly logger = new Logger(DocumentValidatorService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
