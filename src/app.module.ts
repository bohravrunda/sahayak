import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // loads .env globally
    TypeOrmModule.forRoot({
      // your DB config
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'testdb',
      entities: [User],
      synchronize: true,
    }),
    AuthModule,
    MailModule,
  ],
})
export class AppModule {}
