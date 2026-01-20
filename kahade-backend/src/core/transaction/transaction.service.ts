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
import { UserService } from '@core/user/user.service';
import { ITransactionResponse } from '../../common/interfaces/transaction.interface';
import { Transaction, OrderStatus } from '../../common/shims/prisma-types.shim';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly blockchainService: BlockchainService,
    private readonly paymentService: PaymentService,
    private readonly userService: UserService,
  ) {}

  async create(userId: string, createTransactionDto: CreateTransactionDto): Promise<ITransactionResponse> {
    // Validate counterparty exists if provided
    if (createTransactionDto.counterpartyId) {
      const counterparty = await this.userService.findById(createTransactionDto.counterpartyId);
      if (!counterparty) {
        throw new NotFoundException('Counterparty user not found');
      }
      if (counterparty.id === userId) {
        throw new BadRequestException('Cannot create transaction with yourself');
      }
    }

    // Create transaction in database
    const transaction = await this.transactionRepository.create({
      orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      initiatorId: userId,
      initiatorRole: 'BUYER' as any,
      title: createTransactionDto.title,
      description: createTransactionDto.description,
      category: createTransactionDto.category,
      amountMinor: BigInt(Math.round(createTransactionDto.amount * 100)), // Assuming cents
      feePayer: 'BUYER' as any,
      platformFeeMinor: BigInt(0), // Default or calculated
      holdingPeriodDays: 7,
      status: OrderStatus.PENDING_ACCEPT,
      inviteToken: Math.random().toString(36).substring(7),
      inviteExpiresAt: new Date(Date.now() + 86400000),
    } as any);

    // Record on blockchain for transparency
    try {
      const amountNumber = DecimalUtil.toNumber(transaction.amount);
      const blockchainTx = await this.blockchainService.recordTransaction({
        transactionId: transaction.id,
        amount: amountNumber,
        buyerId: userId,
        sellerId: transaction.counterpartyId as string,
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

    if (transaction.initiatorId !== userId && transaction.counterpartyId !== userId) {
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

    if (transaction.initiatorId !== userId && transaction.counterpartyId !== userId) {
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

    if (transaction.counterpartyId !== userId) {
      throw new ForbiddenException('Only seller can confirm payment');
    }

    if (transaction.status !== 'ACCEPTED') {
      throw new BadRequestException('Transaction must be accepted before payment');
    }

    const updated = await this.transactionRepository.update(id, {
      status: OrderStatus.PAID,
      paidAt: new Date(),
    } as any);

    return this.transformToResponse(updated);
  }

  async releaseFunds(id: string, userId: string): Promise<ITransactionResponse> {
    const transaction = await this.transactionRepository.findById(id);
    
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.initiatorId !== userId) {
      throw new ForbiddenException('Only buyer can release funds');
    }

    if (transaction.status !== 'PAID') {
      throw new BadRequestException('Payment must be confirmed first');
    }

    // Process payment to seller - convert Decimal to number
    try {
      const amountNumber = DecimalUtil.toNumber(transaction.amount);
      
      await this.paymentService.transferToSeller({
        amount: amountNumber,
        sellerId: transaction.counterpartyId,
        transactionId: transaction.id,
      });

      const updated = await this.transactionRepository.update(id, {
        status: 'COMPLETED' as any,
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

    if (transaction.initiatorId !== userId && transaction.counterpartyId !== userId) {
      throw new ForbiddenException('Not authorized to cancel this transaction');
    }

    if (transaction.status === 'COMPLETED') {
      throw new BadRequestException('Cannot cancel completed transaction');
    }

    const updated = await this.transactionRepository.update(id, {
      status: 'CANCELLED' as any,
      cancelledAt: new Date(),
    });

    return this.transformToResponse(updated);
  }

  private validateStatusTransition(currentStatus: string, newStatus: string): void {
    const validTransitions: Record<string, string[]> = {
      PENDING_ACCEPT: ['ACCEPTED', 'CANCELLED'],
      ACCEPTED: ['PAID', 'CANCELLED'],
      PAID: ['COMPLETED', 'DISPUTED', 'CANCELLED'],
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
