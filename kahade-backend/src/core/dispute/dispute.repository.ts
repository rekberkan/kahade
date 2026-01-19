import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';

@Injectable()
export class DisputeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.dispute.create({
      data,
      include: {
        transaction: true,
        reporter: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.dispute.findUnique({
      where: { id },
      include: {
        transaction: true,
        reporter: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findByTransaction(transactionId: string) {
    return this.prisma.dispute.findFirst({
      where: { transactionId },
    });
  }

  async findAll() {
    return this.prisma.dispute.findMany({
      include: {
        transaction: true,
        reporter: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.dispute.update({
      where: { id },
      data,
      include: {
        transaction: true,
        reporter: { select: { id: true, name: true, email: true } },
      },
    });
  }
}
