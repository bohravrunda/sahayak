import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { UsersService } from '../src/users/users.service';

describe('Auth Flow (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let usersService: UsersService;

  // Mock Google OAuth2Client
  const mockVerifyIdToken = jest.fn();

  beforeAll(async () => {
    // Mock the OAuth2Client before module initialization
    jest.spyOn(OAuth2Client.prototype, 'verifyIdToken').mockImplementation(mockVerifyIdToken);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Apply the same validation pipe as in production
    app.useGlobalPipes(new ValidationPipe({ 
      whitelist: true, 
      forbidNonWhitelisted: true 
    }));
    
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);
    usersService = moduleFixture.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await app.close();
  }, 30000);

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/google/mobile-login', () => {
    it('should return 200 with valid token and create user on first login', async () => {
      // Mock valid Google token verification
      const mockUserInfo = {
        email: 'newuser@example.com',
        name: 'New User',
        picture: 'https://example.com/picture.jpg',
      };

      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => mockUserInfo,
      });

      const response = await request(app.getHttpServer())
        .post('/auth/google/mobile-login')
        .send({ idToken: 'valid-google-id-token' })
        .expect(201);

      // Verify response structure
      expect(response.body).toHaveProperty('ok', true);
      expect(response.body).toHaveProperty('jwt');
      expect(response.body).toHaveProperty('user');

      // Verify user object
      expect(response.body.user).toMatchObject({
        email: mockUserInfo.email,
        name: mockUserInfo.name,
        picture: mockUserInfo.picture,
        provider: 'google',
      });
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('createdAt');
      expect(response.body.user).toHaveProperty('lastLoginAt');

      // Verify JWT token can be decoded
      const decoded = jwtService.verify(response.body.jwt);
      expect(decoded).toHaveProperty('id', response.body.user.id);
      expect(decoded).toHaveProperty('email', mockUserInfo.email);
      expect(decoded).toHaveProperty('iat');
      expect(decoded).toHaveProperty('exp');

      // Verify user was created in Firestore
      const createdUser = await usersService.getUserByEmail(mockUserInfo.email);
      expect(createdUser).toBeDefined();
      expect(createdUser?.email).toBe(mockUserInfo.email);
    });

    it('should return 200 and update lastLoginAt on subsequent login', async () => {
      // First, create a user
      const mockUserInfo = {
        email: 'testuser@example.com',
        name: 'Test User',
        picture: 'https://example.com/test.jpg',
      };

      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => mockUserInfo,
      });

      // First login
      const firstResponse = await request(app.getHttpServer())
        .post('/auth/google/mobile-login')
        .send({ idToken: 'valid-token-1' })
        .expect(201);

      const firstLoginTime = firstResponse.body.user.lastLoginAt;

      // Wait a moment to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Second login
      const secondResponse = await request(app.getHttpServer())
        .post('/auth/google/mobile-login')
        .send({ idToken: 'valid-token-2' })
        .expect(201);

      const secondLoginTime = secondResponse.body.user.lastLoginAt;

      // Verify lastLoginAt was updated
      expect(secondLoginTime).not.toEqual(firstLoginTime);
      
      // Verify user ID remains the same
      expect(secondResponse.body.user.id).toBe(firstResponse.body.user.id);
      
      // Verify createdAt remains the same
      expect(secondResponse.body.user.createdAt).toEqual(firstResponse.body.user.createdAt);
    });

    it('should return 401 with invalid token', async () => {
      // Mock Google token verification failure
      mockVerifyIdToken.mockRejectedValue(new Error('Token verification failed'));

      const response = await request(app.getHttpServer())
        .post('/auth/google/mobile-login')
        .send({ idToken: 'invalid-google-token' })
        .expect(401);

      expect(response.body).toHaveProperty('statusCode', 401);
      expect(response.body).toHaveProperty('message', 'Invalid authentication token');
    });

    it('should return 400 without token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/google/mobile-login')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
      expect(response.body).toHaveProperty('message');
      expect(Array.isArray(response.body.message)).toBe(true);
    });

    it('should return 400 with empty token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/google/mobile-login')
        .send({ idToken: '' })
        .expect(400);

      expect(response.body).toHaveProperty('statusCode', 400);
    });

    it('should validate JWT token structure and expiration', async () => {
      const mockUserInfo = {
        email: 'jwttest@example.com',
        name: 'JWT Test User',
        picture: 'https://example.com/jwt.jpg',
      };

      mockVerifyIdToken.mockResolvedValue({
        getPayload: () => mockUserInfo,
      });

      const response = await request(app.getHttpServer())
        .post('/auth/google/mobile-login')
        .send({ idToken: 'valid-jwt-test-token' })
        .expect(201);

      const jwt = response.body.jwt;
      const decoded = jwtService.verify(jwt);

      // Verify JWT contains required fields
      expect(decoded).toHaveProperty('id');
      expect(decoded).toHaveProperty('email', mockUserInfo.email);
      expect(decoded).toHaveProperty('iat');
      expect(decoded).toHaveProperty('exp');

      // Verify expiration is set to 7 days (604800 seconds)
      const expirationDuration = decoded.exp - decoded.iat;
      expect(expirationDuration).toBe(604800);
    });
  });
});
