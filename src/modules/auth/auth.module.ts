import { Module } from '@nestjs/common';
import { userRepository } from '../user/user.repository';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './startegies/at.startegy';
import { RefreshTokenStrategy } from './startegies/rt.strategy';
import { googleStrategy } from './startegies/google.strategy';
import { Otp } from '../../common/utils/Otp';
import { MaileModule } from '../mail/mail.module';
import { MailService } from '../mail/mail.service';
@Module({
  imports: [
    JwtModule.register({ secret: process.env.SECRET_KEY }),
    MaileModule,
  ],
  providers: [
    AuthService,
    AuthRepository,
    MailService,
    userRepository,
    RefreshTokenStrategy,
    googleStrategy,
    JwtStrategy,
    Otp,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
