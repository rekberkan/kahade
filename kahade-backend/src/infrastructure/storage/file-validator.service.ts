import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class FileValidatorService {
  private readonly logger = new Logger(FileValidatorService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
