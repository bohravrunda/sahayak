import { Injectable, BadRequestException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { CompleteRegisterDto } from './dto/complete-register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async sendOtp(dto: SendOtpDto) {
    const db = this.firebaseService.getDb();
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP

    await db.collection('otp_verifications').doc(dto.email).set({
      name: dto.name,
      otp,
      createdAt: new Date(),
      verified: false,
    });

    // TODO: Send OTP to email using nodemailer or any email service
    console.log(`OTP for ${dto.email}: ${otp}`);

    return { message: 'OTP sent to email' };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const db = this.firebaseService.getDb();
    const record = await db.collection('otp_verifications').doc(dto.email).get();

    if (!record.exists) throw new BadRequestException('No OTP found for this email');
    const data = record.data();

    if (data?.otp !== dto.verificationCode) {
      throw new BadRequestException('Invalid OTP');
    }

    await db.collection('otp_verifications').doc(dto.email).update({
      verified: true,
    });

    return { message: 'OTP verified successfully' };
  }

  async completeRegistration(dto: CompleteRegisterDto) {
    const db = this.firebaseService.getDb();
    const otpRecord = await db.collection('otp_verifications').doc(dto.email).get();

    if (!otpRecord.exists || !otpRecord.data()?.verified) {
      throw new BadRequestException('OTP not verified');
    }

    // Save user in users collection
    await db.collection('users').doc(dto.email).set({
      name: otpRecord.data()?.name,
      email: dto.email,
      password: dto.password, // 🔒 Ideally hash this with bcrypt before storing
      createdAt: new Date(),
    });

    // Delete OTP record after registration
    await db.collection('otp_verifications').doc(dto.email).delete();

    return { message: 'Registration completed successfully' };
  }
}
