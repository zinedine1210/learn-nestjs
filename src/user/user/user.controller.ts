import { Body, Controller, Get, Header, HttpCode, HttpException, HttpRedirectResponse, Inject, Param, ParseIntPipe, Post, Query, Redirect, Req, Res, UseFilters, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { Request, Response } from 'express';
import { MailService } from '../mail/mail.service';
import { Connection } from '../connection/connection';
import { UserRepository } from '../user-repository/user-repository';
import { MemberService } from '../member/member.service';
import { User } from 'generated/prisma';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { ValidationFilter } from 'src/validation/validation.filter';
import { LoginUserRequest, loginUserRequestValidation } from 'src/model/login.model';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { TimeInterceptor } from 'src/time/time.interceptor';
import { Auth } from 'src/auth/auth.decorator';
import { RoleGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/roles.decorator';

@Controller('/api/users')
export class UserController {
  constructor(
    private connection: Connection,
    private mailService: MailService,
    private userRepository: UserRepository,
    private userService: UserService,
    @Inject('EmailService') private emailService: MailService,
    private memberService: MemberService,
  ){}
  @Post()
  handlePost(): string {
    return 'POST';
  }

  @Get()
  @UseFilters(ValidationFilter)
  handleGet(@Query('name') name: string): string {
    return this.userService.sayHello(name);
  }

  // @Get('/:id')
  // handleGetUser(@Req() request: Request): string {
  //   return `GET ${request.params.id}`;
  // }

  // @Get('/:id')
  // handleGetUser(@Param('id', ParseIntPipe) id: number): string {
  //   console.info(id * 10); // akan nan karena bukan beneran number
  //   return `GET ${id}`;
  // }

  // @Get('/sample')
  // handleGetParamsName(@Req() request: Request): string {
  //   return 'Hallo ' + request.query.name;
  // }

  @Get('/sample')
  handleGetParamsName(
    @Query('firstName') firstName: string,
    @Query('lastName') lastName: string,
  ): string {
    return `Halo ${firstName} ${lastName}`;
  }

  // @Get('sample-response')
  // handleSampleResponse(@Res() response: Response) {
  //   response.status(200).send('Selamatberhasil brooo');
  // }
  // @Get('sample-response')
  // handleSampleResponse(@Res() response: Response) {
  //   response.status(200).json({
  //     data: 'bisa make json broo',
  //   });
  // }
  @Get('sample-response')
  @Header('Content-Type', 'application/json')
  @HttpCode(200)
  handleSampleResponse(): Record<string, string> {
    return {
      data: 'Hallo data',
    };
  }

  @Get('/redirect')
  @Redirect()
  redirect(): HttpRedirectResponse {
    return {
      url: '/api/users/sample-response',
      statusCode: 301,
    };
  }

  // @Get('/promise')
  // async promiseSample(
  //   @Param() params: any
  // ) : Promise<string> {
  //   return 'Hallo gengs ' + params.name + ' Umur saya ' + params.umur;
  // }

  @Get('/set-cookie')
  setCookie(@Query('name') name: string, @Res() response: Response){
    response.cookie('name', name);
    response.status(200).send('Cookie successs to set');
  }

  // @Get('/delete-cookie')
  // deleteCookie(@Query('name') name: string, @Res() response: Response){
  //   response.cookie('name', name);
  //   response.status(200).send('Success delete cookie');
  // }

  @Get('/get-cookie')
  getCookie(@Req() request: Request): string {
    return request.cookies['name'];
  }

  @Get('/connection')
  getConnection(): string {
    // this.mailService.send();
    // this.userRepository.save();
    // this.emailService.send();
    console.log(this.memberService.getConnectionName());
    this.memberService.getSendEmail();
    return this.connection.getName();
  }


  @Post('/create')
  @UseFilters(ValidationFilter)
  postUser(
    @Body() createUserDto: CreateUserDto
  ): Promise<User> {
    // if(!createUserDto.firstName){
    //   throw new HttpException({
    //     code: 400,
    //     errors: 'First name is required',
    //   }, 400);
    // }
    return this.userRepository.save(createUserDto.firstName, createUserDto.lastName);
  }

  @UsePipes(new ValidationPipe(loginUserRequestValidation))
  @Post('/login')
  @UseFilters(ValidationFilter)
  @UseInterceptors(TimeInterceptor)
  @Header('Content-Type', 'application/json')
  login(
    // @Query('name') name: string,
    @Body() request: LoginUserRequest,
  ){
    return {
      data: {
        message: `Hallo bang ganteng namanya ${request.username}`,
      },
    };
  }


  @Get('/custom-decorator')
  @UseGuards(RoleGuard)
  @Roles(['admin', 'operator'])
  customDecorator(
    @Auth() user: User
  ): Record<string, any> {
    return {
      data: `Hello welcome back ${user.first_name} ${user.last_name}`,
    };
  }
}
