import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UserRepository, ICreateUser, IUpdateUser } from './user.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationUtil, PaginationParams } from '@common/utils/pagination.util';
import { IUserResponse } from '@common/interfaces/user.interface';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserData: ICreateUser): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(createUserData.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    return this.userRepository.create(createUserData);
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findAll(params: PaginationParams) {
    const { page = 1, limit = 10 } = params;
    const skip = PaginationUtil.getSkip(page, limit);

    const { users, total } = await this.userRepository.findAll(skip, limit);

    const sanitizedUsers = users.map((user) => this.sanitizeUser(user));

    return PaginationUtil.paginate(sanitizedUsers, total, page, limit);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<IUserResponse> {
    const user = await this.findById(id);

    const updateData: IUpdateUser = {
      ...updateUserDto,
    };

    const updated = await this.userRepository.update(id, updateData);
    return this.sanitizeUser(updated);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userRepository.update(id, {
      lastLoginAt: new Date(),
    });
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.userRepository.delete(id);
  }

  sanitizeUser(user: any): IUserResponse {
    const { passwordHash, ...sanitized } = user;
    return sanitized as IUserResponse;
  }
}
