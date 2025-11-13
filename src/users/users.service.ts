import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service'; // adjust path if needed
import { FirebaseService as FB } from '../firebase/firebase.service';

@Injectable()
export class UsersService {
  // We'll access Firestore directly from FirebaseService inside AuthService to keep simple.
  // This service is a placeholder if you want to move user logic here later.
}
