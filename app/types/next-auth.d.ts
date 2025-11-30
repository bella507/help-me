import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      givenName?: string | null;
      familyName?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
