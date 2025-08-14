import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  name!: string;
  email!: string;
  verificationCode!: string;
  password!: string;
}
