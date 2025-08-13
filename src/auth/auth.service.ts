// src/auth/auth.service.ts
import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const verificationToken = randomBytes(32).toString('hex');

    const user = this.userRepo.create({
      email: dto.email,
      password: hashedPassword,
      verificationToken,
    });

    await this.userRepo.save(user);
    await this.mailService.sendVerificationEmail(user.email, verificationToken);

    return { message: 'User registered. Check your email to verify.' };
  }

  async verifyEmail(token: string) {
    const user = await this.userRepo.findOne({ where: { verificationToken: token } });
    if (!user) throw new NotFoundException('Invalid verification token');

    user.isEmailVerified = true;
    user.verificationToken = null;

    await this.userRepo.save(user);
    return { message: 'Email verified successfully' };
  }
}
