import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDTO {
  @Length(3, 50)
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @Length(6, 100, { message: 'teste' })
  password: string;
}

export class UserLoginDTO {
  @IsEmail()
  email: string;

  @Length(6, 100)
  password: string;
}
