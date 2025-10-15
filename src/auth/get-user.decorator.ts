import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export interface AuthUser {
  userId: number;
  email: string;
}

export function isAuthUser(user: unknown): user is AuthUser {
  return (
    typeof user === 'object' &&
    user !== null &&
    'id' in user &&
    typeof user.id === 'number' &&
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
