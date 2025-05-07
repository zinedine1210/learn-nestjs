import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { mailService, MailService } from './mail/mail.service';
import { UserService } from './user/user.service';
import { Connection, createConnection } from './connection/connection';
import { UserRepository } from './user-repository/user-repository';
import { MemberService } from './member/member.service';
import { ConfigService } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
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
