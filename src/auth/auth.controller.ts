import { Post, Req } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { User } from 'src/models/user.model';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Controller('/')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('greetings')
  public greetings(@Req() req: Request){
    return this.authService.greetings(req);
  }


  @Post('login')
  public login(@Body() body:  Pick<User , 'email' | 'password'>){
    return this.authService.login(body.email , body.password);
  }

  @Post('register')
  public register(@Body() body: Omit<User, 'id'>){
    return this.authService.register(body);
  }


}
