import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Configuration
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import redisConfig from './config/redis.config';
import blockchainConfig from './config/blockchain.config';
import emailConfig from './config/email.config';
import paymentConfig from './config/payment.config';

// Infrastructure
import { DatabaseModule } from './infrastructure/database/database.module';
import { CacheModule } from './infrastructure/cache/cache.module';
import { QueueModule } from './infrastructure/queue/queue.module';
import { StorageModule } from './infrastructure/storage/storage.module';

// Core Modules
import { AuthModule } from './core/auth/auth.module';
import { UserModule } from './core/user/user.module';
import { TransactionModule } from './core/transaction/transaction.module';
import { DisputeModule } from './core/dispute/dispute.module';
import { NotificationModule } from './core/notification/notification.module';

// Integrations
import { BlockchainModule } from './integrations/blockchain/blockchain.module';
import { PaymentModule } from './integrations/payment/payment.module';
import { EmailModule } from './integrations/email/email.module';

// Jobs
import { JobsModule } from './jobs/jobs.module';

// Health Check
import { HealthModule } from './health/health.module';

// Security
import { rateLimitConfig } from './security/rate-limit.config';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        databaseConfig,
        jwtConfig,
        redisConfig,
        blockchainConfig,
        emailConfig,
        paymentConfig,
      ],
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'development'}`,
        '.env',
      ],
    }),

    // SECURITY FIX: Rate Limiting with proper config
    ThrottlerModule.forRoot(rateLimitConfig),

    // Queue Management
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
          password: process.env.REDIS_PASSWORD,
        },
        prefix: process.env.QUEUE_PREFIX || 'kahade',
      }),
    }),

    // Infrastructure
    DatabaseModule,
    CacheModule,
    QueueModule,
    StorageModule,

    // Core Modules
    AuthModule,
    UserModule,
    TransactionModule,
    DisputeModule,
    NotificationModule,

    // Integrations
    BlockchainModule,
    PaymentModule,
    EmailModule,

    // Jobs (Background Processors)
    JobsModule,

    // Health Check
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // SECURITY FIX: Apply ThrottlerGuard globally
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
