import { Request } from "express";

export interface CreateUser extends Request {
  body: {
    name: string;
    email: string;
    password: string;
  };
}

export interface verifyEmailRequest extends Request {
  body: {
    userId: string;
    token: string;
  };
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        profile: {
          id: any;
          name: string;
          email: string;
          verified: boolean;
          avatar?: string;
          followers: number;
          following: number;
        };
        token: string;
      };
    }
  }
}

