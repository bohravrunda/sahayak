import {
  IsString,
  IsNumberString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsBoolean,
} from "class-validator";
import { Type } from "class-transformer";

class EmergencyContactDto {
  @IsString()
  name!: string;

  @IsString()
  relationship!: string;

  @IsString()
  phone!: string;
}

class AutoSharingDto {
  @IsBoolean()
  location!: boolean;

  @IsBoolean()
  audio!: boolean;

  @IsBoolean()
  video!: boolean;
}

export class CreateProfileDto {
  @IsString()
  fullName!: string;

  @IsOptional()
  @IsString()
  age!: string;

  @IsOptional()
  @IsString()
  dateOfBirth!: string;

  @IsString()
  gender!: string;

  @IsString()
  mobileNumber!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmergencyContactDto)
  emergencyContacts!: EmergencyContactDto[];

  @IsString()
  alertMode!: string;

  @IsString()
  triggerPreference!: string;

  @ValidateNested()
  @Type(() => AutoSharingDto)
  autoSharing!: AutoSharingDto;
}
