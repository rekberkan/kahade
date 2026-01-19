import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    return this.userRepository.create(createUserDto);
  }

  async findById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findById(id);
    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: string) {
    const user = await this.findById(id);
    return this.userRepository.delete(id);
  }

  async findAll(skip: number = 0, take: number = 10) {
    return this.userRepository.findAll(skip, take);
  }
}
