import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionStatusDto } from './dto/update-transaction-status.dto';
import { PaginationUtil, PaginationParams } from '@common/utils/pagination.util';
import { BlockchainService } from '@integrations/blockchain/blockchain.service';
import { PaymentService } from '@integrations/payment/payment.service';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly blockchainService: BlockchainService,
    private readonly paymentService: PaymentService,
  ) {}

  async create(userId: string, createTransactionDto: CreateTransactionDto) {
    // Create transaction in database
    const transaction = await this.transactionRepository.create({
      ...createTransactionDto,
      buyerId: userId,
      status: 'PENDING',
    });

    // Record on blockchain for transparency
    try {
      const blockchainTx = await this.blockchainService.recordTransaction({
        transactionId: transaction.id,
        amount: transaction.amount,
        buyerId: userId,
        sellerId: transaction.sellerId,
      });

      await this.transactionRepository.update(transaction.id, {
        blockchainTxHash: blockchainTx.hash,
      });
    } catch (error) {
      console.error('Failed to record on blockchain:', error);
    }

    return transaction;
  }

  async findOne(id: string, userId: string) {
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.buyerId !== userId && transaction.sellerId !== userId) {
      throw new ForbiddenException('Not authorized to view this transaction');
    }

    return transaction;
  }

  async findAllByUser(userId: string, params: PaginationParams) {
    const { page = 1, limit = 10 } = params;
    const skip = PaginationUtil.getSkip(page, limit);

    const { transactions, total } = await this.transactionRepository.findByUser(userId, skip, limit);

    return PaginationUtil.paginate(transactions, total, page, limit);
  }

  async updateStatus(id: string, userId: string, updateStatusDto: UpdateTransactionStatusDto) {
    const transaction = await this.findOne(id, userId);

    // Validate status transition
    this.validateStatusTransition(transaction.status, updateStatusDto.status);

    return this.transactionRepository.update(id, {
      status: updateStatusDto.status,
    });
  }

  async confirmPayment(id: string, userId: string) {
    const transaction = await this.findOne(id, userId);

    if (transaction.sellerId !== userId) {
      throw new ForbiddenException('Only seller can confirm payment');
    }

    if (transaction.status !== 'PENDING') {
      throw new BadRequestException('Invalid transaction status');
    }

    return this.transactionRepository.update(id, {
      status: 'PAYMENT_CONFIRMED',
      paidAt: new Date(),
    });
  }

  async releaseFunds(id: string, userId: string) {
    const transaction = await this.findOne(id, userId);

    if (transaction.buyerId !== userId) {
      throw new ForbiddenException('Only buyer can release funds');
    }

    if (transaction.status !== 'PAYMENT_CONFIRMED') {
      throw new BadRequestException('Payment must be confirmed first');
    }

    // Process payment to seller
    try {
      const payment = await this.paymentService.transferToSeller({
        amount: transaction.amount,
        sellerId: transaction.sellerId,
        transactionId: transaction.id,
      });

      return this.transactionRepository.update(id, {
        status: 'COMPLETED',
        completedAt: new Date(),
      });
    } catch (error) {
      throw new BadRequestException('Failed to release funds');
    }
  }

  async cancel(id: string, userId: string) {
    const transaction = await this.findOne(id, userId);

    if (transaction.status === 'COMPLETED') {
      throw new BadRequestException('Cannot cancel completed transaction');
    }

    return this.transactionRepository.update(id, {
      status: 'CANCELLED',
      cancelledAt: new Date(),
    });
  }

  private validateStatusTransition(currentStatus: string, newStatus: string) {
    const validTransitions: Record<string, string[]> = {
      PENDING: ['PAYMENT_CONFIRMED', 'CANCELLED'],
      PAYMENT_CONFIRMED: ['COMPLETED', 'DISPUTED', 'CANCELLED'],
      DISPUTED: ['COMPLETED', 'CANCELLED'],
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new BadRequestException(`Invalid status transition from ${currentStatus} to ${newStatus}`);
    }
  }
}
