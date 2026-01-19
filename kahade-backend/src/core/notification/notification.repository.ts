import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';

@Injectable()
export class NotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.notification.create({
      data,
    });
  }

  async findById(id: string) {
    return this.prisma.notification.findUnique({
      where: { id },
    });
  }

  async findByUser(userId: string, skip: number, take: number) {
    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({
        where: { userId },
      }),
    ]);

    return { notifications, total };
  }

  async update(id: string, data: any) {
    return this.prisma.notification.update({
      where: { id },
      data,
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }
}
