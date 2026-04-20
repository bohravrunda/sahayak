import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { UpdateSettingsDto } from './dto/settings.dto';

@Injectable()
export class SettingsService {
  constructor(private firebase: FirebaseService) {}

  // GET SETTINGS
  async getSettings(userId: string) {
    const doc = await this.firebase.firestore
      .collection('settings')
      .doc(userId)
      .get();

    return doc.exists ? doc.data() : null;
  }

  // UPDATE SETTINGS
  async updateSettings(userId: string, data: UpdateSettingsDto) {

    const settingsRef = this.firebase.firestore.collection('settings').doc(userId);

    // Get old settings (optional but recommended)
    const existingDoc = await settingsRef.get();
    const existingData = existingDoc.exists ? existingDoc.data() : {};

    // Merge permissions deeply
    const updatedData = {
      ...existingData,
      ...data,
      permissions: {
        ...(existingData?.permissions || {}),
        ...(data.permissions || {}),
      },
      updatedAt: new Date(),
    };

    await settingsRef.set(updatedData, { merge: true });

    return {
      message: 'Settings saved successfully',
      data: updatedData,
    };
  }
}
