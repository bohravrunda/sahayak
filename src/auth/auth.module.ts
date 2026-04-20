import { Module } from '@nestjs/common';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './jwt-strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../mail/mail.module';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [
    MailModule,
    FirebaseModule,

    // ✅ Register passport
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // ✅ Register JWT module
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_secret_key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    JwtStrategy, // ✅ VERY IMPORTANT
  ],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
