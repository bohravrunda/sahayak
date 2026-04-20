import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class ProfileService {
  private collection = 'profiles';

  constructor(private firebase: FirebaseService) {}

  // CREATE PROFILE
  async createProfile(email: string, data: any) {
    const ref = this.firebase.firestore.collection(this.collection).doc(email);

    const doc = await ref.get();
    if (doc.exists) {
      throw new Error('Profile already exists');
    }

    await ref.set({
      ...data,
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { message: 'Profile created successfully' };
  }

  // GET PROFILE (use email)
  async getProfile(email: string) {
    const doc = await this.firebase.firestore
      .collection(this.collection)
      .doc(email)
      .get();

    if (!doc.exists) {
      throw new NotFoundException('Profile not found');
    }

    return doc.data();
  }

  // UPDATE PROFILE
  async updateProfile(email: string, data: any) {
    const ref = this.firebase.firestore
      .collection(this.collection)
      .doc(email);

    const doc = await ref.get();
    if (!doc.exists) {
      throw new NotFoundException('Profile not found');
    }

    await ref.update({
      ...data,
      updatedAt: new Date(),
    });

    return { message: 'Profile updated successfully' };
  }
}
