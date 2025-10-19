import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from '@prisma/client';

export interface AuthUser {
  userId: number;
  email: string;
  role: Role;
}

export function isAuthUser(user: unknown): user is AuthUser {
  return (
    typeof user === 'object' &&
    user !== null &&
    'userId' in user &&
    typeof user.userId === 'number' &&
    'email' in user &&
    typeof user.email === 'string'
  );
}

export const GetUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): AuthUser => {
    const request = context.switchToHttp().getRequest();
    const { user } = request;

    if (!isAuthUser(user)) {
      throw new UnauthorizedException('Invalid or missing user in request');
    }

    return user;
  },
);
