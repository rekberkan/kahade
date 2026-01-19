import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.transaction.create({
      data,
      include: {
        buyer: { select: { id: true, name: true, email: true } },
        seller: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.transaction.findUnique({
      where: { id },
      include: {
        buyer: { select: { id: true, name: true, email: true } },
        seller: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findByUser(userId: string, skip: number, take: number) {
    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where: {
          OR: [
            { buyerId: userId },
            { sellerId: userId },
          ],
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
          OR: [
            { buyerId: userId },
            { sellerId: userId },
          ],
        },
      }),
    ]);

    return { transactions, total };
  }

  async update(id: string, data: any) {
    return this.prisma.transaction.update({
      where: { id },
      data,
      include: {
        buyer: { select: { id: true, name: true, email: true } },
        seller: { select: { id: true, name: true, email: true } },
      },
    });
  }
}
