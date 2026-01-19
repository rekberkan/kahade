import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { ICreateDispute, IUpdateDispute } from '@common/interfaces/dispute.interface';
import { Dispute } from '@prisma/client';

@Injectable()
export class DisputeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: ICreateDispute): Promise<Dispute> {
    return this.prisma.dispute.create({
      data,
      include: {
        reporter: { select: { id: true, name: true, email: true } },
        transaction: {
          include: {
            buyer: { select: { id: true, name: true, email: true } },
            seller: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });
  }

  async findById(id: string): Promise<Dispute | null> {
    return this.prisma.dispute.findUnique({
      where: { id },
      include: {
        reporter: { select: { id: true, name: true, email: true } },
        transaction: {
          include: {
            buyer: { select: { id: true, name: true, email: true } },
            seller: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });
  }

  async findAll(skip: number, take: number): Promise<{ disputes: Dispute[]; total: number }> {
    const [disputes, total] = await Promise.all([
      this.prisma.dispute.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          reporter: { select: { id: true, name: true, email: true } },
          transaction: {
            include: {
              buyer: { select: { id: true, name: true, email: true } },
              seller: { select: { id: true, name: true, email: true } },
            },
          },
        },
      }),
      this.prisma.dispute.count(),
    ]);

    return { disputes, total };
  }

  async findByUser(userId: string, skip: number, take: number): Promise<{ disputes: Dispute[]; total: number }> {
    const [disputes, total] = await Promise.all([
      this.prisma.dispute.findMany({
        where: { reporterId: userId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          reporter: { select: { id: true, name: true, email: true } },
          transaction: {
            include: {
              buyer: { select: { id: true, name: true, email: true } },
              seller: { select: { id: true, name: true, email: true } },
            },
          },
        },
      }),
      this.prisma.dispute.count({ where: { reporterId: userId } }),
    ]);

    return { disputes, total };
  }

  async findByTransaction(transactionId: string): Promise<Dispute[]> {
    return this.prisma.dispute.findMany({
      where: { transactionId },
      orderBy: { createdAt: 'desc' },
      include: {
        reporter: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async update(id: string, data: IUpdateDispute): Promise<Dispute> {
    return this.prisma.dispute.update({
      where: { id },
      data,
      include: {
        reporter: { select: { id: true, name: true, email: true } },
        transaction: {
          include: {
            buyer: { select: { id: true, name: true, email: true } },
            seller: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });
  }

  async delete(id: string): Promise<Dispute> {
    return this.prisma.dispute.delete({
      where: { id },
    });
  }
}
