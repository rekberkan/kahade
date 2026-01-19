import { Module } from '@nestjs/common';
import { DisputeController } from './dispute.controller';
import { DisputeService } from './dispute.service';
import { DisputeRepository } from './dispute.repository';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [DatabaseModule, TransactionModule],
  controllers: [DisputeController],
  providers: [DisputeService, DisputeRepository],
  exports: [DisputeService],
})
export class DisputeModule {}
