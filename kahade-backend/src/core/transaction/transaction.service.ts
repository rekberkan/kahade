import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionStatusDto } from './dto/update-transaction-status.dto';
import { PaginationUtil, PaginationParams } from '@common/utils/pagination.util';
import { DecimalUtil } from '@common/utils/decimal.util';
import { BlockchainService } from '@integrations/blockchain/blockchain.service';
import { PaymentService } from '@integrations/payment/payment.service';
import { ITransactionResponse } from '@common/interfaces/transaction.interface';
import { Transaction, TransactionStatus } from '@prisma/client';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly blockchainService: BlockchainService,
    private readonly paymentService: PaymentService,
  ) {}

  async create(userId: string, createTransactionDto: CreateTransactionDto): Promise<ITransactionResponse> {
    // Create transaction in database
    const transaction = await this.transactionRepository.create({
      ...createTransactionDto,
      buyerId: userId,
      status: 'PENDING' as TransactionStatus,
    });

    // Record on blockchain for transparency
    try {
      const amountNumber = DecimalUtil.toNumber(transaction.amount);
      const blockchainTx = await this.blockchainService.recordTransaction({
        transactionId: transaction.id,
        amount: amountNumber,
        buyerId: userId,
        sellerId: transaction.sellerId,
      });

      await this.transactionRepository.update(transaction.id, {
        blockchainTxHash: blockchainTx.hash,
      });
    } catch (error) {
      this.logger.error(`Failed to record on blockchain: ${error.message}`);
      // Don't fail transaction creation if blockchain fails
    }

    return this.transformToResponse(transaction);
  }

  async findOne(id: string, userId: string): Promise<ITransactionResponse> {
    const transaction = await this.transactionRepository.findById(id);
    
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.buyerId !== userId && transaction.sellerId !== userId) {
      throw new ForbiddenException('Not authorized to view this transaction');
    }

    return this.transformToResponse(transaction);
  }

  async findAllByUser(userId: string, params: PaginationParams) {
    const { page = 1, limit = 10 } = params;
    const skip = PaginationUtil.getSkip(page, limit);

    const { transactions, total } = await this.transactionRepository.findByUser(userId, skip, limit);

    const transformedTransactions = transactions.map((t) => this.transformToResponse(t));

    return PaginationUtil.paginate(transformedTransactions, total, page, limit);
  }

  async updateStatus(
    id: string,
    userId: string,
    updateStatusDto: UpdateTransactionStatusDto,
  ): Promise<ITransactionResponse> {
    const transaction = await this.transactionRepository.findById(id);
    
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.buyerId !== userId && transaction.sellerId !== userId) {
      throw new ForbiddenException('Not authorized to update this transaction');
    }

    // Validate status transition
    this.validateStatusTransition(transaction.status, updateStatusDto.status);

    const updated = await this.transactionRepository.update(id, {
      status: updateStatusDto.status,
    });

    return this.transformToResponse(updated);
  }

  async confirmPayment(id: string, userId: string): Promise<ITransactionResponse> {
    const transaction = await this.transactionRepository.findById(id);
    
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.sellerId !== userId) {
      throw new ForbiddenException('Only seller can confirm payment');
    }

    if (transaction.status !== 'PENDING') {
      throw new BadRequestException('Invalid transaction status');
    }

    const updated = await this.transactionRepository.update(id, {
      status: 'PAYMENT_CONFIRMED' as TransactionStatus,
      paidAt: new Date(),
    });

    return this.transformToResponse(updated);
  }

  async releaseFunds(id: string, userId: string): Promise<ITransactionResponse> {
    const transaction = await this.transactionRepository.findById(id);
    
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.buyerId !== userId) {
      throw new ForbiddenException('Only buyer can release funds');
    }

    if (transaction.status !== 'PAYMENT_CONFIRMED') {
      throw new BadRequestException('Payment must be confirmed first');
    }

    // Process payment to seller - convert Decimal to number
    try {
      const amountNumber = DecimalUtil.toNumber(transaction.amount);
      
      await this.paymentService.transferToSeller({
        amount: amountNumber,
        sellerId: transaction.sellerId,
        transactionId: transaction.id,
      });

      const updated = await this.transactionRepository.update(id, {
        status: 'COMPLETED' as TransactionStatus,
        completedAt: new Date(),
      });

      return this.transformToResponse(updated);
    } catch (error) {
      this.logger.error(`Failed to release funds: ${error.message}`);
      throw new BadRequestException('Failed to release funds');
    }
  }

  async cancel(id: string, userId: string): Promise<ITransactionResponse> {
    const transaction = await this.transactionRepository.findById(id);
    
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.buyerId !== userId && transaction.sellerId !== userId) {
      throw new ForbiddenException('Not authorized to cancel this transaction');
    }

    if (transaction.status === 'COMPLETED') {
      throw new BadRequestException('Cannot cancel completed transaction');
    }

    const updated = await this.transactionRepository.update(id, {
      status: 'CANCELLED' as TransactionStatus,
      cancelledAt: new Date(),
    });

    return this.transformToResponse(updated);
  }

  private validateStatusTransition(currentStatus: string, newStatus: string): void {
    const validTransitions: Record<string, string[]> = {
      PENDING: ['PAYMENT_CONFIRMED', 'CANCELLED'],
      PAYMENT_CONFIRMED: ['COMPLETED', 'DISPUTED', 'CANCELLED'],
      DISPUTED: ['COMPLETED', 'CANCELLED', 'REFUNDED'],
      CANCELLED: [],
      COMPLETED: [],
      REFUNDED: [],
    };

    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new BadRequestException(`Invalid status transition from ${currentStatus} to ${newStatus}`);
    }
  }

  private transformToResponse(transaction: Transaction & any): ITransactionResponse {
    return {
      ...transaction,
      amount: DecimalUtil.toNumber(transaction.amount), // Convert Decimal to number
    };
  }
}
