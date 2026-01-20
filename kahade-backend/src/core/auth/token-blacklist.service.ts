import { Injectable } from '@nestjs/common';
@Injectable()
export class TokenBlacklistService {
  async isBlacklisted(token: string): Promise<boolean> { return false; }
  async blacklist(token: string): Promise<void> {}
}
