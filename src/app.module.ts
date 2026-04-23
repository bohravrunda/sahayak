// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FirebaseModule } from './firebase/firebase.module';
import { MailModule } from './mail/mail.module';
import { ProfileModule } from './profile/profile.module';
import { SettingsModule } from './settings/settings.module';
import { EmergencyModule } from './emergency/emergency.module';



@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    FirebaseModule,   // 🔥 Firebase first (recommended)
    AuthModule,
    ProfileModule,
    MailModule,
        SettingsModule, // 🔥 ADD THIS
        EmergencyModule

  ],
})
export class AppModule {}
