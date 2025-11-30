import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

interface GoogleProfile {
  sub: string;
  name: string;
  email: string;
  picture: string;
  given_name?: string;
  family_name?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const googleProfile = profile as GoogleProfile;
        token.given_name = googleProfile.given_name;
        token.family_name = googleProfile.family_name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || '';
        session.user.givenName = token.given_name as string;
        session.user.familyName = token.family_name as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
