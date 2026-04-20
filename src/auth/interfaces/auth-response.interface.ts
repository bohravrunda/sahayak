import { User } from '../../users/interfaces/user.interface';

export interface AuthResponse {
  ok: boolean;
  jwt: string;
  user: User;
}
