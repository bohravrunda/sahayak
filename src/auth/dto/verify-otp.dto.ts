import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 10) // we expect 6 by default
  otp!: string;
}