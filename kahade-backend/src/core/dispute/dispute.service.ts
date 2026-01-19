import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { DisputeRepository } from './dispute.repository';
import { TransactionRepository } from '../transaction/transaction.repository';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { ResolveDisputeDto } from './dto/resolve-dispute.dto';
import { PaginationUtil, PaginationParams } from '@common/utils/pagination.util';
import { Dispute, DisputeStatus, TransactionStatus } from '@prisma/client';

@Injectable()
export class DisputeService {
  private readonly logger = new Logger(DisputeService.name);

  constructor(
    private readonly disputeRepository: DisputeRepository,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async create(userId: string, createDisputeDto: CreateDisputeDto): Promise<Dispute> {
    // Verify transaction exists and user is part of it
    const transaction = await this.transactionRepository.findById(createDisputeDto.transactionId);
    
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.buyerId !== userId && transaction.sellerId !== userId) {
      throw new ForbiddenException('You are not part of this transaction');
    }

    // Check if transaction can be disputed
    if (transaction.status === 'COMPLETED' || transaction.status === 'CANCELLED') {
      throw new BadRequestException('Cannot dispute completed or cancelled transaction');
    }

    // Check if there's already an open dispute
    const existingDisputes = await this.disputeRepository.findByTransaction(transaction.id);
    const openDispute = existingDisputes.find(
      (d) => d.status === 'PENDING' || d.status === 'UNDER_REVIEW',
    );

    if (openDispute) {
      throw new BadRequestException('There is already an open dispute for this transaction');
    }

    // Create dispute
    const dispute = await this.disputeRepository.create({
      ...createDisputeDto,
      reporterId: userId,
      status: 'PENDING' as DisputeStatus,
    });

    // Update transaction status
    await this.transactionRepository.update(transaction.id, {
      status: 'DISPUTED' as TransactionStatus,
    });

    this.logger.log(`Dispute created: ${dispute.id} for transaction: ${transaction.id}`);

    return dispute;
  }

  async findAll(params?: PaginationParams) {
    const { page = 1, limit = 10 } = params || {};
    const skip = PaginationUtil.getSkip(page, limit);

    const { disputes, total } = await this.disputeRepository.findAll(skip, limit);

    return PaginationUtil.paginate(disputes, total, page, limit);
  }

  async findOne(id: string, userId: string): Promise<Dispute> {
    const dispute = await this.disputeRepository.findById(id);
    
    if (!dispute) {
      throw new NotFoundException('Dispute not found');
    }

    // Check authorization
    const transaction = await this.transactionRepository.findById(dispute.transactionId);
    if (
      transaction &&
      dispute.reporterId !== userId &&
      transaction.buyerId !== userId &&
      transaction.sellerId !== userId
    ) {
      throw new ForbiddenException('Not authorized to view this dispute');
    }

    return dispute;
  }

  async resolve(id: string, resolveDisputeDto: ResolveDisputeDto): Promise<Dispute> {
    const dispute = await this.disputeRepository.findById(id);
    
    if (!dispute) {
      throw new NotFoundException('Dispute not found');
    }

    if (dispute.status === 'RESOLVED' || dispute.status === 'REJECTED') {
      throw new BadRequestException('Dispute already resolved');
    }

    // Update dispute
    const updated = await this.disputeRepository.update(id, {
      status: resolveDisputeDto.status,
      resolution: resolveDisputeDto.resolution,
      resolvedAt: new Date(),
    });

    // Update transaction based on resolution
    const transaction = await this.transactionRepository.findById(dispute.transactionId);
    if (transaction) {
      let newStatus: TransactionStatus;
      
      if (resolveDisputeDto.status === 'RESOLVED') {
        // Admin decided - could be completed or refunded based on resolution
        newStatus = resolveDisputeDto.resolution?.includes('refund') 
          ? 'REFUNDED' as TransactionStatus
          : 'COMPLETED' as TransactionStatus;
      } else {
        // Dispute rejected - go back to previous status
        newStatus = 'PAYMENT_CONFIRMED' as TransactionStatus;
      }

      await this.transactionRepository.update(transaction.id, {
        status: newStatus,
      });
    }

    this.logger.log(`Dispute resolved: ${id} with status: ${resolveDisputeDto.status}`);

    return updated;
  }
}
