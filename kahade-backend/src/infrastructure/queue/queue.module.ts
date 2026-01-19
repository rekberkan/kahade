import { Module, Global } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('redis.host', 'localhost'),
          port: configService.get<number>('redis.port', 6379),
          password: configService.get<string>('redis.password'),
        },
        prefix: configService.get<string>('queue.prefix', 'kahade'),
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        },
      }),
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
