import { Timestamp } from 'firebase-admin/firestore';

export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  provider: 'google';
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
}

export interface CreateUserDto {
  email: string;
  name: string;
  picture: string;
  provider: 'google';
}
