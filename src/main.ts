import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

function validateEnvironmentVariables() {
  const requiredEnvVars = [
    'GOOGLE_CLIENT_ID',
    'JWT_SECRET',
  ];

  const missingVars: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  }

  if (missingVars.length > 0) {
    console.error('❌ Application startup failed: Missing required environment variables');
    console.error('❌ The following environment variables are required but not set:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('❌ Please ensure all required environment variables are set in your .env file');
    process.exit(1);
  }

  console.log('✅ Environment variable validation passed');
}

async function bootstrap() {
  // Validate environment variables before starting the application
  validateEnvironmentVariables();

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  console.log('👉 ENV TEST SMTP_HOST:', process.env.SMTP_HOST);
  console.log('👉 ENV TEST SMTP_USER:', process.env.SMTP_USER);

  await app.listen(process.env.PORT || 3000);
  console.log(`🚀 Server running on http://localhost:${process.env.PORT || 3000}`);
}
bootstrap();
