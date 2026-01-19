import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

// Configuration
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import redisConfig from './config/redis.config';
import blockchainConfig from './config/blockchain.config';
import emailConfig from './config/email.config';
import paymentConfig from './config/payment.config';
import queueConfig from './config/queue.config';

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

// Integration Modules
import { BlockchainModule } from './integrations/blockchain/blockchain.module';
import { PaymentModule } from './integrations/payment/payment.module';
import { EmailModule } from './integrations/email/email.module';

// Jobs
import { JobsModule } from './jobs/jobs.module';

// Common
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

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
        queueConfig,
      ],
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'development'}`,
        '.env',
      ],
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

    // Integration Modules
    BlockchainModule,
    PaymentModule,
    EmailModule,

    // Jobs
    JobsModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
