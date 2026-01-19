import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EmailProcessor } from './email.processor';
import { NotificationProcessor } from './notification.processor';
import { BlockchainProcessor } from './blockchain.processor';
import { EmailModule } from '@integrations/email/email.module';
import { NotificationModule } from '@core/notification/notification.module';
import { BlockchainModule } from '@integrations/blockchain/blockchain.module';
import { QUEUE_NAMES } from '@common/constants';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: QUEUE_NAMES.EMAIL },
      { name: QUEUE_NAMES.NOTIFICATION },
      { name: QUEUE_NAMES.BLOCKCHAIN },
    ),
    EmailModule,
    NotificationModule,
    BlockchainModule,
  ],
  providers: [EmailProcessor, NotificationProcessor, BlockchainProcessor],
  exports: [BullModule],
})
export class JobsModule {}
