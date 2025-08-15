import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class RegisterStep2Dto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password!: string;

  @IsNotEmpty()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
    message: 'Passwords do not match', // optional, but better for custom error
  })
  confirmPassword!: string;
}
