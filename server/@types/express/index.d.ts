export interface IAuthUserPayload {
  id: string;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      currentUser: IAuthUserPayload;
      auth?: {
        sessionId: string;
      };
    }
  }
}
