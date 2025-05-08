import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { mailService, MailService } from './mail/mail.service';
import { UserService } from './user/user.service';
import { Connection, createConnection } from './connection/connection';
import { UserRepository } from './user-repository/user-repository';
import { MemberService } from './member/member.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: MailService,
      useValue: mailService,
    },
    UserService,
    {
      provide: Connection,
      useFactory: createConnection,
      inject: [ConfigService],
    },
    UserRepository,
    {
      provide: 'EmailService',
      useExisting: MailService,
    },
    MemberService,
  ],
})
export class UserModule {}
