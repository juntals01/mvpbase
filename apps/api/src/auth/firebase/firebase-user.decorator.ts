// apps/api/src/auth/firebase-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const FirebaseUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as {
      uid: string;
      email: string | null;
      name: string | null;
      picture: string | null;
    };
  },
);
