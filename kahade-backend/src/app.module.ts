import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Configuration
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import redisConfig from './config/redis.config';
import blockchainConfig from './config/blockchain.config';

// Infrastructure
import { DatabaseModule } from './infrastructure/database/database.module';
import { CacheModule } from './infrastructure/cache/cache.module';

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

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, redisConfig, blockchainConfig],
      envFilePath: [
        `.env.${process.env.NODE_ENV || 'development'}`,
        '.env',
      ],
    }),

    // Rate Limiting
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),

    // Infrastructure
    DatabaseModule,
    CacheModule,

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
