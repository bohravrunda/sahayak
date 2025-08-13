// src/auth/dto/register.dto.ts
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  email!: string;
  password!: string;
}
