import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  Headers,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { SetPasswordDto } from './dto/set-password.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyResetOtpDto } from './dto/verify-reset-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ---------------- GOOGLE WEB LOGIN ----------------
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.handleGoogleLogin(req.user);
  }

  // ---------------- GOOGLE MOBILE LOGIN (🔥 FIX) ----------------
  @Post('google/mobile-login')
  async googleMobileLogin(@Body() body: { idToken: string }) {
    try {
      if (!body.idToken) {
        throw new HttpException('No ID token provided', HttpStatus.BAD_REQUEST);
      }

      return await this.authService.verifyGoogleToken(body.idToken);
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Google login failed', HttpStatus.BAD_REQUEST);
    }
  }
  // ---------------- LOGOUT ----------------
@Post('logout')
async logout() {
  return this.authService.logout();
}

  // ---------------- SIGNUP ----------------
  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    await this.authService.signup(dto.name, dto.email);
    return { ok: true, message: 'OTP sent to email' };
  }

  // ---------------- VERIFY OTP ----------------
  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    const res = await this.authService.verifyOtp(dto.email, dto.otp);
    return { ok: true, token: res.token };
  }

  // ---------------- SET PASSWORD ----------------
  @Post('set-password')
  async setPassword(
    @Body() dto: SetPasswordDto,
    @Headers('authorization') authHeader: string,
  ) {
    if (!authHeader) {
      throw new HttpException('No token provided', HttpStatus.UNAUTHORIZED);
    }

    const token = authHeader.replace('Bearer ', '');
    const email = this.authService.verifyJwt(token);

    await this.authService.setPassword(email, dto.password);

    return { ok: true, message: 'Password set successfully' };
  }

  // ---------------- LOGIN ----------------
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const res = await this.authService.login(dto.email, dto.password);
    return res;
  }

  // ---------------- FORGOT PASSWORD ----------------
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('verify-reset-otp')
  async verifyResetOtp(@Body() dto: VerifyResetOtpDto) {
    return this.authService.verifyResetOtp(dto.email, dto.otp);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.email, dto.newPassword);
  }
}

