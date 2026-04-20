import { Controller, Get, Put, Body, Req, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/settings.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @UseGuards(JwtAuthGuard)
  @Put()
  updateSettings(@Req() req, @Body() body: UpdateSettingsDto) {
    console.log("REQ USER:", req.user);
    return this.settingsService.updateSettings(req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getSettings(@Req() req) {
    return this.settingsService.getSettings(req.user.userId);
  }
}
