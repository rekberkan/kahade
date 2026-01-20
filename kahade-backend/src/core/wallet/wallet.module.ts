import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { WalletRepository } from './wallet.repository';
import { BalanceService } from './balance.service';
import { BalanceLockService } from './balance-lock.service';
import { ReconciliationService } from './reconciliation.service';
import { TransactionLimitService } from './transaction-limit.service';

@Module({
  controllers: [WalletController],
  providers: [
    WalletService,
    WalletRepository,
    BalanceService,
    BalanceLockService,
    ReconciliationService,
    TransactionLimitService,
  ],
  exports: [WalletService, WalletRepository],
})
export class WalletModule {}
