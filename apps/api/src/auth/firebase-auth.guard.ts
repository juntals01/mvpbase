// apps/api/src/auth/firebase-auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyIdToken } from './firebase.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest<Request & { user?: any }>();
    const auth = (req.headers as any).authorization as string | undefined;

    if (!auth || !auth.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing Authorization Bearer token');
    }
    const token = auth.slice('Bearer '.length).trim();
    try {
      const decoded = await verifyIdToken(token);
      (req as any).user = decoded;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid Firebase token');
    }
  }
}
