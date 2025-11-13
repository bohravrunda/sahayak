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

  // --------------------- GOOGLE OAUTH ---------------------
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Redirects to Google OAuth login
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    // req.user contains Google profile
    return this.authService.handleGoogleLogin(req.user);
  }

  // --------------------- SIGNUP ---------------------
  @Post('signup')
  async signup(@Body() dto: SignupDto) {
    try {
      await this.authService.signup(dto.name, dto.email);
      return { ok: true, message: 'OTP sent to email' };
    } catch (err) {
      throw new HttpException(
        err.message || 'Signup failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // --------------------- VERIFY OTP ---------------------
  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    try {
      const res = await this.authService.verifyOtp(dto.email, dto.otp);
      return { ok: true, message: 'OTP verified', token: res.token };
    } catch (err) {
      throw new HttpException(
        err.message || 'OTP verification failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // --------------------- SET PASSWORD ---------------------
  @Post('set-password')
  async setPassword(
    @Body() dto: SetPasswordDto,
    @Headers('authorization') authHeader: string,
  ) {
    try {
      if (!authHeader) {
        throw new HttpException('No token provided', HttpStatus.UNAUTHORIZED);
      }

      if (dto.password !== dto.confirmPassword) {
        throw new HttpException(
          'Password and Confirm Password do not match',
          HttpStatus.BAD_REQUEST,
        );
      }

      const token = authHeader.replace('Bearer ', '');
      const email = this.authService.verifyJwt(token);

      await this.authService.setPassword(email, dto.password);

      return { ok: true, message: 'Password set successfully' };
    } catch (err) {
      throw new HttpException(
        err.message || 'Setting password failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // --------------------- LOGIN ---------------------
  @Post('login')
  async login(@Body() dto: LoginDto) {
    try {
      const res = await this.authService.login(dto.email, dto.password);
      return { ok: true, ...res };
    } catch (err) {
      throw new HttpException(
        err.message || 'Login failed',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  // --------------------- FORGOT PASSWORD ---------------------
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
