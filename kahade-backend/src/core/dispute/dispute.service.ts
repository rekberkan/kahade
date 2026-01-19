import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { DisputeRepository } from './dispute.repository';
import { TransactionService } from '../transaction/transaction.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { ResolveDisputeDto } from './dto/resolve-dispute.dto';

@Injectable()
export class DisputeService {
  constructor(
    private readonly disputeRepository: DisputeRepository,
    private readonly transactionService: TransactionService,
  ) {}

  async create(userId: string, createDisputeDto: CreateDisputeDto) {
    const transaction = await this.transactionService.findOne(createDisputeDto.transactionId, userId);

    if (transaction.status === 'COMPLETED' || transaction.status === 'CANCELLED') {
      throw new BadRequestException('Cannot create dispute for completed or cancelled transaction');
    }

    const existingDispute = await this.disputeRepository.findByTransaction(createDisputeDto.transactionId);
    if (existingDispute) {
      throw new BadRequestException('Dispute already exists for this transaction');
    }

    return this.disputeRepository.create({
      ...createDisputeDto,
      reporterId: userId,
      status: 'PENDING',
    });
  }

  async findOne(id: string, userId: string) {
    const dispute = await this.disputeRepository.findById(id);
    if (!dispute) {
      throw new NotFoundException('Dispute not found');
    }

    if (dispute.reporterId !== userId && dispute.transaction.buyerId !== userId && dispute.transaction.sellerId !== userId) {
      throw new ForbiddenException('Not authorized to view this dispute');
    }

    return dispute;
  }

  async findAll() {
    return this.disputeRepository.findAll();
  }

  async resolve(id: string, resolveDisputeDto: ResolveDisputeDto) {
    const dispute = await this.disputeRepository.findById(id);
    if (!dispute) {
      throw new NotFoundException('Dispute not found');
    }

    if (dispute.status !== 'PENDING') {
      throw new BadRequestException('Dispute already resolved');
    }

    return this.disputeRepository.update(id, {
      status: 'RESOLVED',
      resolution: resolveDisputeDto.resolution,
      resolvedAt: new Date(),
    });
  }
}
