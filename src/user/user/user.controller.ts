import { Controller, Get, Header, HttpCode, HttpRedirectResponse, Inject, Post, Query, Redirect, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { MailService } from '../mail/mail.service';
import { Connection } from '../connection/connection';
import { UserRepository } from '../user-repository/user-repository';
import { MemberService } from '../member/member.service';

@Controller('/api/users')
export class UserController {
  constructor(
    private connection: Connection,
    private mailService: MailService,
    private userRepository: UserRepository,
    @Inject('EmailService') private emailService: MailService,
    private memberService: MemberService,
  ){}
  @Post()
  handlePost(): string {
    return 'POST';
  }

  @Get()
  handleGet(): string {
    return 'Hallo Bro';
  }

  // @Get('/:id')
  // handleGetUser(@Req() request: Request): string {
  //   return request.params.id;
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
}
