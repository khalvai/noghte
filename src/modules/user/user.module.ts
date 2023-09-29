import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  providers: [UserService, UserRepository],
  controllers: [],
})
export class UserModule {}
