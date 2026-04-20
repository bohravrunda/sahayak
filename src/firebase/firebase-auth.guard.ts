import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    // ❌ No Authorization header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split(' ')[1];

    try {
      // ✅ Verify Firebase ID token
      const decodedToken = await admin.auth().verifyIdToken(token);

      // 🔥 attach user to request
      request.user = decodedToken; // { uid, email, name, etc }

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired Firebase token');
    }
  }
}
