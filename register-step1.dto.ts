import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterStep1Dto {
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;
}