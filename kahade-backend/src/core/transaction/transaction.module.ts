import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from './transaction.repository';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { BlockchainModule } from '@integrations/blockchain/blockchain.module';
import { PaymentModule } from '@integrations/payment/payment.module';

import { UserModule } from '@core/user/user.module';

@Module({
  imports: [DatabaseModule, BlockchainModule, PaymentModule, UserModule],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository],
  exports: [TransactionService, TransactionRepository],
})
export class TransactionModule {}
