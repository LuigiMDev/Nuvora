import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDTO, UserLoginDTO } from 'src/DTOs/user';
import { PrismaService } from 'src/PrismaService/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class RepositoryUserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser({
    name,
    email,
    password,
  }: CreateUserDTO): Promise<User | null> {
    const passwordEncrypted = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: passwordEncrypted,
      },
    });
    return user;
  }

  async userLogin({ email, password }: UserLoginDTO): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async findUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
}
