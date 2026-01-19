import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DocumentScannerService {
  private readonly logger = new Logger(DocumentScannerService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
