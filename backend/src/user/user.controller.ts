import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO, UserLoginDTO } from 'src/DTOs/user';
import { Request, Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}
  @Post('create')
  async createUser(
    @Body() newUser: CreateUserDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.service.createUser(newUser, res);
  }

  @Post('login')
  async userLogin(
    @Body() user: UserLoginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.service.userLogin(user, res);
  }

  @Post('loginWithToken')
  async userLoginWithToken(@Req() req: Request) {
    return await this.service.userLoginWithToken(req);
  }
}
