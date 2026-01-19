import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { NotificationRepository, ICreateNotification } from './notification.repository';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { PaginationUtil, PaginationParams } from '@common/utils/pagination.util';
import { Notification, NotificationType } from '@prisma/client';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly notificationRepository: NotificationRepository) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const notification = await this.notificationRepository.create(createNotificationDto);
    this.logger.log(`Notification created: ${notification.id} for user: ${notification.userId}`);
    return notification;
  }

  async createForUser(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    metadata?: any,
  ): Promise<Notification> {
    const data: ICreateNotification = {
      userId,
      type,
      title,
      message,
      metadata,
    };

    return this.notificationRepository.create(data);
  }

  async findAllByUser(userId: string, params: PaginationParams) {
    const { page = 1, limit = 10 } = params;
    const skip = PaginationUtil.getSkip(page, limit);

    const { notifications, total } = await this.notificationRepository.findByUser(userId, skip, limit);

    return PaginationUtil.paginate(notifications, total, page, limit);
  }

  async findUnread(userId: string): Promise<Notification[]> {
    return this.notificationRepository.findUnreadByUser(userId);
  }

  async countUnread(userId: string): Promise<number> {
    return this.notificationRepository.countUnread(userId);
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    const notification = await this.notificationRepository.findById(id);
    
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException('Not authorized to update this notification');
    }

    return this.notificationRepository.markAsRead(id);
  }

  async markAllAsRead(userId: string): Promise<{ count: number }> {
    const count = await this.notificationRepository.markAllAsRead(userId);
    this.logger.log(`Marked ${count} notifications as read for user: ${userId}`);
    return { count };
  }

  async delete(id: string, userId: string): Promise<void> {
    const notification = await this.notificationRepository.findById(id);
    
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException('Not authorized to delete this notification');
    }

    await this.notificationRepository.delete(id);
  }

  async deleteAll(userId: string): Promise<{ count: number }> {
    const count = await this.notificationRepository.deleteAllByUser(userId);
    this.logger.log(`Deleted ${count} notifications for user: ${userId}`);
    return { count };
  }
}
