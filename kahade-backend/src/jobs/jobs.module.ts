import { Module, Logger } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EmailProcessor } from './email.processor';
import { NotificationProcessor } from './notification.processor';
import { BlockchainProcessor } from './blockchain.processor';
import { EmailModule } from '@integrations/email/email.module';
import { NotificationModule } from '@core/notification/notification.module';
import { BlockchainModule } from '@integrations/blockchain/blockchain.module';
import { QUEUE_NAMES } from '@common/constants';

const useRedis = process.env.REDIS_ENABLED === 'true';

@Module({
  imports: [
    ...(useRedis ? [
      BullModule.registerQueue(
        { name: QUEUE_NAMES.EMAIL },
        { name: QUEUE_NAMES.NOTIFICATION },
        { name: QUEUE_NAMES.BLOCKCHAIN },
      ),
    ] : []),
    EmailModule,
    NotificationModule,
    BlockchainModule,
  ],
  providers: useRedis ? [EmailProcessor, NotificationProcessor, BlockchainProcessor] : [],
  exports: useRedis ? [BullModule] : [],
})
export class JobsModule {
  constructor() {
    if (!useRedis) {
      Logger.warn('Job processors disabled (Redis not available)', 'JobsModule');
    }
  }
}
