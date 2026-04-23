import { Controller, Post, Body } from '@nestjs/common';
import { EmergencyService } from './emergency.service';

@Controller('emergency')
export class EmergencyController {
  constructor(private readonly emergencyService: EmergencyService) {}

  @Post('alert')
  async sendEmergencyAlert(@Body() body: any) {
    return this.emergencyService.handleAlert(body);
  }
}