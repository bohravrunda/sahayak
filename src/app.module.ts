import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FirebaseModule } from './firebase/firebase.module';
import { MailModule } from './mail/mail.module';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,   // ✅ ab har jagah .env available hoga
      envFilePath: '.env', // ✅ explicit path
    }),
    FirebaseModule,
    MailModule,
    AuthModule,
  ],
  providers: [UsersService],
})
export class AppModule {}
