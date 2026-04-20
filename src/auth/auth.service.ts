import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { MailService } from '../mail/mail.service';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  private otpLength = parseInt(process.env.OTP_LENGTH || '6', 10);
  private otpTtlSec = parseInt(process.env.OTP_TTL_SECONDS || '600', 10); // seconds

  constructor(
    private readonly firebase: FirebaseService,
    private readonly mail: MailService
  ) {}

  // --------------------- GOOGLE LOGIN ---------------------
  async handleGoogleLogin(user: any) {
    if (!user) {
      return 'No user from Google';
    }

    const db = this.firebase.firestore;
    const emailNorm = user.email.trim().toLowerCase();

    const userRef = db.collection('users').doc(emailNorm);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      // Create new user in DB
      await userRef.set({
        name: `${user.firstName} ${user.lastName}`,
        email: emailNorm,
        picture: user.picture,
        createdAt: new Date(),
        emailVerified: true, // Google login => verified
      });
    }

    // Generate JWT
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error('JWT_SECRET not defined in .env');

    const token = jwt.sign({ email: emailNorm }, jwtSecret, { expiresIn: '1h' });

    return {
      message: 'User info from Google',
      user: {
        name: `${user.firstName} ${user.lastName}`,
        email: emailNorm,
        picture: user.picture,
      },
      token,
    };
  }

  // --------------------- OTP GENERATION ---------------------
  private generateNumericOtp(length = 6) {
    const max = 10 ** length;
    const num = crypto.randomInt(0, max);
    return num.toString().padStart(length, '0');
  }

  private async hashOtp(otp: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(otp, salt);
  }

  private async compareOtp(otp: string, hashed: string) {
    return bcrypt.compare(otp, hashed);
  }

  // --------------------- SIGNUP ---------------------
  async signup(name: string, email: string) {
    const db = this.firebase.firestore;
    const emailNorm = email.trim().toLowerCase();

    const userRef = db.collection('users').doc(emailNorm);
    const userSnap = await userRef.get();
    if (userSnap.exists) {
      const data = userSnap.data();
      if (data?.emailVerified) throw new Error('Email already verified. Please login.');
    } else {
      await userRef.set({
        name,
        email: emailNorm,
        createdAt: new Date(),
        emailVerified: false,
      });
    }

    // generate OTP
    const otp = this.generateNumericOtp(this.otpLength);
    const otpHashed = await this.hashOtp(otp);
    const expiresAt = new Date(Date.now() + this.otpTtlSec * 1000);

    const otpDoc = {
      email: emailNorm,
      otpHash: otpHashed,
      createdAt: new Date(),
      expiresAt,
      attempts: 0,
    };
    await db.collection('emailOtps').doc(emailNorm).set(otpDoc);

    await this.mail.sendMail(emailNorm, 'Your OTP Code', `Your OTP code is: ${otp}`);

    this.logger.log(`OTP generated and sent to ${emailNorm}`);
    return { ok: true };
  }

  // --------------------- VERIFY OTP ---------------------
  async verifyOtp(email: string, otp: string) {
    const db = this.firebase.firestore;
    const emailNorm = email.trim().toLowerCase();

    const otpRef = db.collection('emailOtps').doc(emailNorm);
    const otpSnap = await otpRef.get();
    if (!otpSnap.exists) throw new Error('No OTP found. Request a new OTP.');

    const otpData = otpSnap.data() as any;
    if (!otpData) throw new Error('OTP record invalid.');

    const expiresAt = otpData.expiresAt.toDate ? otpData.expiresAt.toDate() : new Date(otpData.expiresAt);
    if (new Date() > expiresAt) {
      await otpRef.delete();
      throw new Error('OTP expired. Request a new OTP.');
    }

    const maxAttempts = 5;
    if (otpData.attempts >= maxAttempts) throw new Error('Too many attempts. Request a new OTP.');

    const ok = await this.compareOtp(otp, otpData.otpHash);
    if (!ok) {
      await otpRef.update({ attempts: (otpData.attempts || 0) + 1 });
      throw new Error('Invalid OTP.');
    }

    // mark user as verified
    const userRef = db.collection('users').doc(emailNorm);
    await userRef.set({ emailVerified: true, verifiedAt: new Date() }, { merge: true });
    await otpRef.delete();

    const userSnap = await userRef.get();
    const user = userSnap.exists ? userSnap.data() : null;

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error('JWT_SECRET not defined in .env');

    const token = jwt.sign({ id: emailNorm }, jwtSecret, { expiresIn: '1h' });

    return { user, token };
  }

  // --------------------- SET PASSWORD ---------------------
  async setPassword(email: string, password: string) {
    const db = this.firebase.firestore;

    const userRef = db.collection('users').doc(email);
    const userSnap = await userRef.get();

    if (!userSnap.exists || !userSnap.data()?.emailVerified) {
      throw new BadRequestException('User not verified. Please complete OTP verification first.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userRef.set({ password: hashedPassword }, { merge: true });

    this.logger.log(`Password set successfully for user ${email}`);
    return { ok: true };
  }

  // --------------------- VERIFY JWT ---------------------
  verifyJwt(token: string): string {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error('JWT_SECRET not defined in .env');

    try {
      const payload = jwt.verify(token, jwtSecret) as any;
      return payload.id || payload.email;
    } catch (err) {
      throw new Error('Invalid or expired token');
    }
  }

  // --------------------- LOGIN ---------------------
  async login(email: string, password: string) {
    const db = this.firebase.firestore;
    const emailNorm = email.trim().toLowerCase();

    const userRef = db.collection('users').doc(emailNorm);
    const userSnap = await userRef.get();

    if (!userSnap.exists) throw new BadRequestException('User not found. Please signup first.');

    const user = userSnap.data();

    if (!user?.password) {
      throw new BadRequestException('Password not set. Please complete signup.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password.');
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error('JWT_SECRET not defined in .env');

    const token = jwt.sign({ email: emailNorm }, jwtSecret, { expiresIn: '1h' });

    return {
      message: 'Login successful',
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    };
  }

  // --------------------- FORGOT PASSWORD ---------------------
  async forgotPassword(email: string) {
    const db = this.firebase.firestore;
    const emailNorm = email.trim().toLowerCase();

    const userRef = db.collection('users').doc(emailNorm);
    const userSnap = await userRef.get();
    if (!userSnap.exists) throw new BadRequestException('User not found.');

    const otp = this.generateNumericOtp(this.otpLength);
    const otpHashed = await this.hashOtp(otp);
    const expiresAt = new Date(Date.now() + this.otpTtlSec * 1000);

    await db.collection('passwordOtps').doc(emailNorm).set({
      email: emailNorm,
      otpHash: otpHashed,
      createdAt: new Date(),
      expiresAt,
      attempts: 0,
    });

    await this.mail.sendMail(emailNorm, 'Password Reset OTP', `Your password reset OTP is: ${otp}`);
    this.logger.log(`Reset OTP sent to ${emailNorm}`);
    return { ok: true, message: 'OTP sent to your email.' };
  }

  // --------------------- VERIFY RESET OTP ---------------------
  async verifyResetOtp(email: string, otp: string) {
    const db = this.firebase.firestore;
    const emailNorm = email.trim().toLowerCase();

    const otpRef = db.collection('passwordOtps').doc(emailNorm);
    const otpSnap = await otpRef.get();
    if (!otpSnap.exists) throw new BadRequestException('No OTP found. Request new one.');

    const otpData = otpSnap.data() as any;
    const expiresAt = otpData.expiresAt.toDate ? otpData.expiresAt.toDate() : new Date(otpData.expiresAt);
    if (new Date() > expiresAt) {
      await otpRef.delete();
      throw new BadRequestException('OTP expired. Request new one.');
    }

    const ok = await this.compareOtp(otp, otpData.otpHash);
    if (!ok) throw new BadRequestException('Invalid OTP.');

    await otpRef.update({ verified: true });
    return { ok: true, message: 'OTP verified successfully.' };
  }

  // --------------------- RESET PASSWORD ---------------------
  async resetPassword(email: string, newPassword: string) {
    const db = this.firebase.firestore;
    const emailNorm = email.trim().toLowerCase();

    const otpRef = db.collection('passwordOtps').doc(emailNorm);
    const otpSnap = await otpRef.get();
    if (!otpSnap.exists) throw new BadRequestException('Please verify OTP first.');

    const otpData = otpSnap.data() as any;
    if (!otpData.verified) throw new BadRequestException('OTP not verified.');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.collection('users').doc(emailNorm).set(
      {
        password: hashedPassword,
        updatedAt: new Date(),
      },
      { merge: true },
    );

    await otpRef.delete();
    this.logger.log(`Password reset successfully for user ${emailNorm}`);
    return { ok: true, message: 'Password reset successful.' };
  }
}