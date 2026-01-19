import { ThrottlerModuleOptions } from '@nestjs/throttler';

export const rateLimitConfig: ThrottlerModuleOptions = [
  {
    name: 'short',
    ttl: 1000, // 1 second
    limit: 3,
  },
  {
    name: 'medium',
    ttl: 10000, // 10 seconds
    limit: 20,
  },
  {
    name: 'long',
    ttl: 60000, // 1 minute
    limit: 100,
  },
];
