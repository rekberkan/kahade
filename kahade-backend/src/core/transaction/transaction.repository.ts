import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { ICreateTransaction, IUpdateTransaction } from '@common/interfaces/transaction.interface';
import { Transaction } from '@prisma/client';

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: ICreateTransaction): Promise<Transaction> {
    return this.prisma.transaction.create({
      data,
      include: {
        buyer: { select: { id: true, name: true, email: true } },
        seller: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findById(id: string): Promise<Transaction | null> {
    return this.prisma.transaction.findUnique({
      where: { id },
      include: {
        buyer: { select: { id: true, name: true, email: true } },
        seller: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findByUser(
    userId: string,
    skip: number,
    take: number,
  ): Promise<{ transactions: Transaction[]; total: number }> {
    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where: {
          OR: [{ buyerId: userId }, { sellerId: userId }],
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          buyer: { select: { id: true, name: true, email: true } },
          seller: { select: { id: true, name: true, email: true } },
        },
      }),
      this.prisma.transaction.count({
        where: {
          OR: [{ buyerId: userId }, { sellerId: userId }],
        },
      }),
    ]);

    return { transactions, total };
  }

  async update(id: string, data: IUpdateTransaction): Promise<Transaction> {
    return this.prisma.transaction.update({
      where: { id },
      data,
      include: {
        buyer: { select: { id: true, name: true, email: true } },
        seller: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async delete(id: string): Promise<Transaction> {
    return this.prisma.transaction.delete({
      where: { id },
    });
  }

  async findAll(skip: number, take: number): Promise<{ transactions: Transaction[]; total: number }> {
    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          buyer: { select: { id: true, name: true, email: true } },
          seller: { select: { id: true, name: true, email: true } },
        },
      }),
      this.prisma.transaction.count(),
    ]);

    return { transactions, total };
  }
}
