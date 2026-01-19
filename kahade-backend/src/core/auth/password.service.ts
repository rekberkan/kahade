import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PasswordService {
  private readonly logger = new Logger(PasswordService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
