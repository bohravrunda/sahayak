import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { FirebaseService } from '../firebase/firebase.service';

@Module({
  controllers: [SettingsController],
  providers: [SettingsService, FirebaseService],
  exports: [SettingsService], // 👈 if other modules need settings
})
export class SettingsModule {}
