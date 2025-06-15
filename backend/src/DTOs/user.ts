import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @Length(3, 50)
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  @IsEmail({}, { message: 'O e-mail deve ser válido' })
  email: string;

  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @Length(6, 100, { message: 'A senha deve ter entre 6 à 100 caracteres' })
  password: string;
}

export class UserLoginDTO {
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  @IsEmail({}, { message: 'O e-mail deve ser válido' })
  email: string;

  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @Length(6, 100, { message: 'A senha deve ter entre 6 à 100 caracteres' })
  password: string;
}
