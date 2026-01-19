import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AssignmentService {
  private readonly logger = new Logger(AssignmentService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
