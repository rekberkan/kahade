import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { User, UserRole, UserStatus } from '@prisma/client';

export interface ICreateUser {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface IUpdateUser {
  name?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  role?: UserRole;
  status?: UserStatus;
  emailVerified?: boolean;
  emailVerifiedAt?: Date;
  lastLoginAt?: Date;
}

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: ICreateUser): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...data,
        role: data.role || 'USER',
        status: data.status || 'ACTIVE',
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findAll(skip: number, take: number): Promise<{ users: User[]; total: number }> {
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return { users, total };
  }

  async update(id: string, data: IUpdateUser): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async count(): Promise<number> {
    return this.prisma.user.count();
  }

  async findByRole(role: UserRole, skip: number, take: number): Promise<{ users: User[]; total: number }> {
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: { role },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where: { role } }),
    ]);

    return { users, total };
  }

  async findByStatus(status: UserStatus, skip: number, take: number): Promise<{ users: User[]; total: number }> {
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: { status },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where: { status } }),
    ]);

    return { users, total };
  }
}
