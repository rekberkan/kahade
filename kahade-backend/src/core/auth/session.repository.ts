import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';

@Injectable()
export class SessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { userId: string; token: string; expiresAt: Date }) {
    return this.prisma.session.create({
      data: {
        userId: data.userId,
        refreshHash: data.token, // Store token hash or token
        expiresAt: data.expiresAt,
        sessionFamilyId: 'default',
      },
    });
  }

  async findByToken(token: string) {
    return this.prisma.session.findFirst({
      where: {
        refreshHash: token,
      },
    });
  }

  async revoke(token: string) {
    return this.prisma.session.updateMany({
      where: {
        refreshHash: token,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }
}
