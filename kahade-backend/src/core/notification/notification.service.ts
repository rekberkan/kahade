import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { NotificationRepository } from './notification.repository';
import { PaginationUtil, PaginationParams } from '@common/utils/pagination.util';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async create(userId: string, data: { type: string; title: string; message: string }) {
    return this.notificationRepository.create({
      ...data,
      userId,
      read: false,
    });
  }

  async findAllByUser(userId: string, params: PaginationParams) {
    const { page = 1, limit = 20 } = params;
    const skip = PaginationUtil.getSkip(page, limit);

    const { notifications, total } = await this.notificationRepository.findByUser(userId, skip, limit);

    return PaginationUtil.paginate(notifications, total, page, limit);
  }

  async markAsRead(id: string, userId: string) {
    const notification = await this.notificationRepository.findById(id);
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException('Not authorized');
    }

    return this.notificationRepository.update(id, { read: true });
  }

  async markAllAsRead(userId: string) {
    return this.notificationRepository.markAllAsRead(userId);
  }
}
