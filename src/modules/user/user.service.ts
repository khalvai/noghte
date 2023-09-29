import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(user) {
    this.userRepository.upsert(user);
  }

  async findAll() {
    this.userRepository.findAll();
  }

  async findOne(id: number) {
    return this.userRepository.findUnique(id);
  }
  async findByEmail(email: string) {
    return true;
  }
}
