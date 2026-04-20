import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { User, CreateUserDto } from './interfaces/user.interface';
import { Timestamp } from 'firebase-admin/firestore';

@Injectable()
export class UsersService {
  constructor(private readonly firebaseService: FirebaseService) {}

  /**
   * Query users collection by email field
   * @param email - User's email address
   * @returns User object if found, null otherwise
   */
  async getUserByEmail(email: string): Promise<User | null> {
    const usersRef = this.firebaseService.firestore.collection('users');
    const snapshot = await usersRef.where('email', '==', email).limit(1).get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    } as User;
  }

  /**
   * Create new user document with auto-generated ID
   * @param userData - User data to create
   * @returns Created user object with Firestore document ID
   */
  async createUser(userData: CreateUserDto): Promise<User> {
    const usersRef = this.firebaseService.firestore.collection('users');
    const now = Timestamp.now();

    const userDoc = {
      email: userData.email,
      name: userData.name,
      picture: userData.picture,
      provider: userData.provider,
      createdAt: now,
      lastLoginAt: now,
    };

    const docRef = await usersRef.add(userDoc);

    return {
      id: docRef.id,
      ...userDoc,
    };
  }

  /**
   * Update lastLoginAt timestamp for existing user
   * @param userId - Firestore document ID of the user
   */
  async updateLastLogin(userId: string): Promise<void> {
    const userRef = this.firebaseService.firestore.collection('users').doc(userId);
    await userRef.update({
      lastLoginAt: Timestamp.now(),
    });
  }
}
