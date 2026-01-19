import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CommentService {
  private readonly logger = new Logger(CommentService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
