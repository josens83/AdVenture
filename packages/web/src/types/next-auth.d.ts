import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      subscription: string;
      subscriptionEnd: Date | null;
      emailVerified: Date | null;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    subscription?: string;
    subscriptionEnd?: Date | null;
    emailVerified?: Date | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    subscription?: string;
    subscriptionEnd?: Date | null;
    emailVerified?: Date | null;
  }
}
