import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { ICreateTransaction, IUpdateTransaction } from '@common/interfaces/transaction.interface';
import { Transaction } from '../../common/shims/prisma-types.shim';

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: ICreateTransaction): Promise<Transaction> {
    return (this.prisma as any).order.create({
      data,
      include: {
        initiator: { select: { id: true, name: true, email: true } },
        counterparty: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findById(id: string): Promise<Transaction | null> {
    return (this.prisma as any).order.findUnique({
      where: { id },
      include: {
        initiator: { select: { id: true, name: true, email: true } },
        counterparty: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findByUser(
    userId: string,
    skip: number,
    take: number,
  ): Promise<{ transactions: Transaction[]; total: number }> {
    const [transactions, total] = await Promise.all([
      (this.prisma as any).order.findMany({
        where: {
          OR: [{ initiatorId: userId }, { counterpartyId: userId }],
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          initiator: { select: { id: true, name: true, email: true } },
          counterparty: { select: { id: true, name: true, email: true } },
        },
      }),
      (this.prisma as any).order.count({
        where: {
          OR: [{ initiatorId: userId }, { counterpartyId: userId }],
        },
      }),
    ]);

    return { transactions, total };
  }

  async update(id: string, data: IUpdateTransaction): Promise<Transaction> {
    return (this.prisma as any).order.update({
      where: { id },
      data,
      include: {
        initiator: { select: { id: true, name: true, email: true } },
        counterparty: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async delete(id: string): Promise<Transaction> {
    return (this.prisma as any).order.delete({
      where: { id },
    });
  }

  async findAll(skip: number, take: number): Promise<{ transactions: Transaction[]; total: number }> {
    const [transactions, total] = await Promise.all([
      (this.prisma as any).order.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          initiator: { select: { id: true, name: true, email: true } },
          counterparty: { select: { id: true, name: true, email: true } },
        },
      }),
      (this.prisma as any).order.count(),
    ]);

    return { transactions, total };
  }
}
