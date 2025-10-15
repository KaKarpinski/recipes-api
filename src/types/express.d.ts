import { AuthUser } from '../auth/get-user.decorator';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
