import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from 'src/DTOs/user';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}
  @Post('create')
  async createUser(@Body() newUser: CreateUserDTO) {
    return await this.service.createUser(newUser);
  }
}
