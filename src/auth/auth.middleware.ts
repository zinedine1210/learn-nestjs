import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private prismaService: PrismaService){}

  async use(req: any, res: any, next: () => void) {
    const username = req.headers['x-username'];
    console.log(typeof username);

    if(!username){
      throw new UnauthorizedException();
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        id: Number(username),
      },
    });
    console.log(user)

    if(user){
      req.user = user;
      next();
    }else{
      throw new UnauthorizedException();
    }
  }
}
