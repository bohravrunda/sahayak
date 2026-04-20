import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // ✅ GET PROFILE
@UseGuards(JwtAuthGuard)
@Get()
getProfile(@Req() req) {
  return this.profileService.getProfile(req.user.email);
}

@UseGuards(JwtAuthGuard)
@Post()
createProfile(@Req() req, @Body() dto) {
  return this.profileService.createProfile(req.user.email, dto);
}

@UseGuards(JwtAuthGuard)
@Put()
updateProfile(@Req() req, @Body() body) {
  return this.profileService.updateProfile(req.user.email, body);
}
}