import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FirebaseService } from '../firebase/firebase.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, FirebaseService],
})
export class AuthModule {}
