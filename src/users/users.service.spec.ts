import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { FirebaseService } from '../firebase/firebase.service';
import { Timestamp } from 'firebase-admin/firestore';

describe('UsersService', () => {
  let service: UsersService;
  let firebaseService: jest.Mocked<FirebaseService>;

  const mockFirestore = {
    collection: jest.fn(),
  };

  const mockUserData = {
    email: 'test@example.com',
    name: 'Test User',
    picture: 'https://example.com/picture.jpg',
    provider: 'google' as const,
  };

  const mockTimestamp = Timestamp.now();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: FirebaseService,
          useValue: {
            firestore: mockFirestore,
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    firebaseService = module.get(FirebaseService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserByEmail', () => {
    it('should return user when found', async () => {
      const mockDoc = {
        id: 'user123',
        data: () => ({
          email: mockUserData.email,
          name: mockUserData.name,
          picture: mockUserData.picture,
          provider: mockUserData.provider,
          createdAt: mockTimestamp,
          lastLoginAt: mockTimestamp,
        }),
      };

      const mockSnapshot = {
        empty: false,
        docs: [mockDoc],
      };

      const mockGet = jest.fn().mockResolvedValue(mockSnapshot);
      const mockLimit = jest.fn().mockReturnValue({ get: mockGet });
      const mockWhere = jest.fn().mockReturnValue({ limit: mockLimit });
      const mockCollection = jest.fn().mockReturnValue({ where: mockWhere });

      mockFirestore.collection = mockCollection;

      const result = await service.getUserByEmail(mockUserData.email);

      expect(mockCollection).toHaveBeenCalledWith('users');
      expect(mockWhere).toHaveBeenCalledWith('email', '==', mockUserData.email);
      expect(mockLimit).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        id: 'user123',
        email: mockUserData.email,
        name: mockUserData.name,
        picture: mockUserData.picture,
        provider: mockUserData.provider,
        createdAt: mockTimestamp,
        lastLoginAt: mockTimestamp,
      });
    });

    it('should return null when user not found', async () => {
      const mockSnapshot = {
        empty: true,
        docs: [],
      };

      const mockGet = jest.fn().mockResolvedValue(mockSnapshot);
      const mockLimit = jest.fn().mockReturnValue({ get: mockGet });
      const mockWhere = jest.fn().mockReturnValue({ limit: mockLimit });
      const mockCollection = jest.fn().mockReturnValue({ where: mockWhere });

      mockFirestore.collection = mockCollection;

      const result = await service.getUserByEmail('nonexistent@example.com');

      expect(mockCollection).toHaveBeenCalledWith('users');
      expect(mockWhere).toHaveBeenCalledWith('email', '==', 'nonexistent@example.com');
      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create user document with correct fields', async () => {
      const mockDocRef = {
        id: 'newuser123',
      };

      const mockAdd = jest.fn().mockResolvedValue(mockDocRef);
      const mockCollection = jest.fn().mockReturnValue({ add: mockAdd });

      mockFirestore.collection = mockCollection;

      // Mock Timestamp.now()
      jest.spyOn(Timestamp, 'now').mockReturnValue(mockTimestamp);

      const result = await service.createUser(mockUserData);

      expect(mockCollection).toHaveBeenCalledWith('users');
      expect(mockAdd).toHaveBeenCalledWith({
        email: mockUserData.email,
        name: mockUserData.name,
        picture: mockUserData.picture,
        provider: mockUserData.provider,
        createdAt: mockTimestamp,
        lastLoginAt: mockTimestamp,
      });
      expect(result).toEqual({
        id: 'newuser123',
        email: mockUserData.email,
        name: mockUserData.name,
        picture: mockUserData.picture,
        provider: mockUserData.provider,
        createdAt: mockTimestamp,
        lastLoginAt: mockTimestamp,
      });
    });
  });

  describe('updateLastLogin', () => {
    it('should update lastLoginAt timestamp', async () => {
      const userId = 'user123';
      const mockUpdate = jest.fn().mockResolvedValue(undefined);
      const mockDoc = jest.fn().mockReturnValue({ update: mockUpdate });
      const mockCollection = jest.fn().mockReturnValue({ doc: mockDoc });

      mockFirestore.collection = mockCollection;

      // Mock Timestamp.now()
      jest.spyOn(Timestamp, 'now').mockReturnValue(mockTimestamp);

      await service.updateLastLogin(userId);

      expect(mockCollection).toHaveBeenCalledWith('users');
      expect(mockDoc).toHaveBeenCalledWith(userId);
      expect(mockUpdate).toHaveBeenCalledWith({
        lastLoginAt: mockTimestamp,
      });
    });
  });
});
