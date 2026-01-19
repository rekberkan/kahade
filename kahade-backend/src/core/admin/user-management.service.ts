import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UserManagementService {
  private readonly logger = new Logger(UserManagementService.name);

  async healthCheck(): Promise<{ status: string }> {
    this.logger.debug('Health check called');
    return { status: 'ok' };
  }
}
