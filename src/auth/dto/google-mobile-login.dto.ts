import { IsString, IsNotEmpty } from 'class-validator';

export class GoogleMobileLoginDto {
  @IsString()
  @IsNotEmpty()
  idToken!: string;
}
