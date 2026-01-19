import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    role?: string;
  };
}
