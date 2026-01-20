import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard as NestThrottlerGuard } from '@nestjs/throttler';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class ThrottlerGuard extends NestThrottlerGuard {
  constructor(protected readonly reflector: Reflector) {
    super({ throttlers: [] }, {}, reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Skip rate limiting for public endpoints if needed
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // You can customize rate limiting based on isPublic
    // For now, apply rate limiting to all endpoints
    
    return super.canActivate(context);
  }

  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Use user ID if authenticated, otherwise use IP
    if (req.user && req.user.id) {
      return `user:${req.user.id}`;
    }
    
    return req.ip || req.connection.remoteAddress || 'unknown';
  }
}