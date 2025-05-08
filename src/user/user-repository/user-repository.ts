import { Inject, Injectable } from '@nestjs/common';
import { User } from 'generated/prisma';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { Logger } from 'winston';

@Injectable()
export class UserRepository {
    constructor(
        private prismaService: PrismaService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    ){
        console.info(`Create user repository`);
        this.logger.info(`Create user repository with winston`);
    }

    async save(firstName: string, lastName?: string): Promise<User> {
        this.logger.info(`Create user with firstName ${firstName} lastName ${lastName}`);
        return this.prismaService.user.create({
            data: {
                first_name: firstName,
                last_name: lastName,
            }
        })
    }
}
