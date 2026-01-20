import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { Prisma } from '@prisma/client';

/**
 * Ledger Lock Service
 * 
 * Implements pessimistic locking for concurrent ledger operations.
 * Prevents double-spending and ensures data consistency.
 */
@Injectable()
export class LedgerLockService {
  private readonly logger = new Logger(LedgerLockService.name);
  private readonly LOCK_TIMEOUT_MS = 5000; // 5 seconds

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Execute ledger operation with wallet lock
   * 
   * Acquires pessimistic lock on wallet row before performing operation.
   * Prevents concurrent modifications to the same wallet.
   */
  async withWalletLock<T>(
    walletId: string,
    operation: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    return await this.prisma.$transaction(
      async (tx) => {
        // Acquire FOR UPDATE lock on wallet
        const wallet = await tx.$queryRaw<Array<{ id: string }>>`
          SELECT id FROM wallets
          WHERE id = ${walletId}
          FOR UPDATE
        `;

        if (!wallet || wallet.length === 0) {
          throw new Error(`Wallet ${walletId} not found`);
        }

        // Execute operation within locked context
        return await operation(tx);
      },
      {
        timeout: this.LOCK_TIMEOUT_MS,
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  }

  /**
   * Execute ledger operation with multiple wallet locks
   * 
   * Acquires locks in deterministic order (by wallet ID) to prevent deadlocks.
   */
  async withMultipleWalletLocks<T>(
    walletIds: string[],
    operation: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    // Sort wallet IDs to ensure consistent lock order (prevent deadlocks)
    const sortedWalletIds = [...walletIds].sort();

    return await this.prisma.$transaction(
      async (tx) => {
        // Acquire FOR UPDATE locks on all wallets
        for (const walletId of sortedWalletIds) {
          await tx.$queryRaw`
            SELECT id FROM wallets
            WHERE id = ${walletId}
            FOR UPDATE
          `;
        }

        // Execute operation within locked context
        return await operation(tx);
      },
      {
        timeout: this.LOCK_TIMEOUT_MS,
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  }

  /**
   * Create double-entry ledger transaction with automatic validation
   */
  async createDoubleEntry(
    tx: Prisma.TransactionClient,
    journalData: {
      type: string;
      description: string;
      metadata?: any;
    },
    entries: Array<{
      walletId: string;
      type: 'DEBIT' | 'CREDIT';
      amountMinor: bigint;
      balanceAfterMinor: bigint;
    }>,
  ): Promise<string> {
    // Validate double-entry: total debits must equal total credits
    const totalDebits = entries
      .filter((e) => e.type === 'DEBIT')
      .reduce((sum, e) => sum + e.amountMinor, BigInt(0));

    const totalCredits = entries
      .filter((e) => e.type === 'CREDIT')
      .reduce((sum, e) => sum + e.amountMinor, BigInt(0));

    if (totalDebits !== totalCredits) {
      throw new ConflictException(
        `Double-entry violation: Debits (${totalDebits}) != Credits (${totalCredits})`,
      );
    }

    // Create journal
    const journal = await tx.ledgerJournal.create({
      data: journalData,
    });

    // Create ledger entries
    await tx.ledgerEntry.createMany({
      data: entries.map((entry) => ({
        journalId: journal.id,
        ...entry,
      })),
    });

    this.logger.log(
      `Double-entry created: Journal ${journal.id}, ${entries.length} entries`,
    );

    return journal.id;
  }

  /**
   * Verify wallet balance matches ledger
   */
  async verifyWalletBalance(
    walletId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<{ isValid: boolean; expected: bigint; actual: bigint }> {
    const client = tx || this.prisma;

    // Get wallet balance
    const wallet = await client.wallet.findUnique({
      where: { id: walletId },
    });

    if (!wallet) {
      throw new Error(`Wallet ${walletId} not found`);
    }

    // Calculate balance from ledger
    const ledgerEntries = await client.ledgerEntry.findMany({
      where: { walletId },
    });

    let calculatedBalance = BigInt(0);
    for (const entry of ledgerEntries) {
      if (entry.type === 'DEBIT') {
        calculatedBalance += entry.amountMinor;
      } else {
        calculatedBalance -= entry.amountMinor;
      }
    }

    const isValid = wallet.balanceMinor === calculatedBalance;

    if (!isValid) {
      this.logger.error(
        `Wallet ${walletId} balance mismatch: ` +
        `Wallet=${wallet.balanceMinor}, Ledger=${calculatedBalance}`,
      );
    }

    return {
      isValid,
      expected: calculatedBalance,
      actual: wallet.balanceMinor,
    };
  }
}