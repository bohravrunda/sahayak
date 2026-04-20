import { IsBoolean, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PermissionsDto {
  @IsOptional()
  @IsBoolean()
  location?: boolean;

  @IsOptional()
  @IsBoolean()
  microphone?: boolean;

  @IsOptional()
  @IsBoolean()
  storage?: boolean;

  @IsOptional()
  @IsBoolean()
  notifications?: boolean;

  @IsOptional()
  @IsBoolean()
  background?: boolean;
}

export class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsBoolean()
  darkTheme?: boolean;

  // 👇 THIS WAS MISSING
  @IsOptional()
  @ValidateNested()
  @Type(() => PermissionsDto)
  permissions?: PermissionsDto;
}
