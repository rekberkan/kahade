import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SubmissionService {
  private readonly logger = new Logger(SubmissionService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
