import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from 'src/DTOs/user';
import { RepositoryUserService } from 'src/repositories/user.service';

@Injectable()
export class UserService {
  constructor(private readonly repo: RepositoryUserService) {}

  async createUser({ name, email, password }: CreateUserDTO) {
    try {
      const newUser = await this.repo.createUser({ name, email, password });
      if(!newUser) {
        throw new Error('User creation failed');
      }
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Ocorreu um erro ao criar o usuário'); 
    }
  }
}
