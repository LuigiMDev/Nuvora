import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDTO, UserLoginDTO } from 'src/DTOs/user';
import { RepositoryUserService } from 'src/repositories/user.service';

@Injectable()
export class UserService {
  constructor(
    private readonly repo: RepositoryUserService,
    private readonly jwt: AuthService,
  ) {}

  async createUser({ name, email, password }: CreateUserDTO, res: Response) {
    try {
      const newUser = await this.repo.createUser({ name, email, password });
      if (!newUser) {
        throw new Error('User creation failed');
      }

      const { token } = this.jwt.generateToken(newUser.id);

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });

      const { password: _, ...userWithoutPassword } = newUser;

      return userWithoutPassword;
    } catch (error) {
      console.error('Error creating user:', error);
      if (
        error instanceof Error &&
        error.message === 'Já existe um usuário com este e-mail'
      ) {
        throw new BadRequestException('Já existe um usuário com este e-mail');
      }
      throw new InternalServerErrorException(
        'Ocorreu um erro ao criar o usuário',
      );
    }
  }

  async userLogin({ email, password }: UserLoginDTO, res: Response) {
    try {
      const user = await this.repo.userLogin({ email, password });
      if (!user) {
        throw new Error('E-mail ou senha inválidos');
      }

      const { token } = this.jwt.generateToken(user.id);

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });

      const { password: _, ...userWithoutPassword } = user;

      return userWithoutPassword;
    } catch (error) {
      console.error('Error creating user:', error);
      if (
        error instanceof Error &&
        error.message === 'E-mail ou senha inválidos'
      ) {
        throw new UnauthorizedException('E-mail ou senha inválidos');
      }
      throw new InternalServerErrorException('Ocorreu um erro ao fazer login');
    }
  }

  async userLoginWithToken(req: Request) {
    try {
      const token = req.cookies.token as string | undefined;
      if (!token) {
        throw new Error('Token não encontrado');
      }

      const { userId } = this.jwt.verifyToken(token);

      const user = await this.repo.findUserById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      const { password: _, ...userWithoutPassword } = user;

      return userWithoutPassword;
    } catch (error) {
      console.error('Error fetching user by token:', error);
      if (error instanceof Error && error.message === 'Token não encontrado') {
        throw new UnauthorizedException('Token não encontrado');
      }
      if (
        error instanceof Error &&
        error.message === 'Token inválido ou expirado'
      ) {
        throw new UnauthorizedException('Token inválido ou expirado');
      }
      throw new InternalServerErrorException(
        'Ocorreu um erro ao buscar o usuário',
      );
    }
  }
}
