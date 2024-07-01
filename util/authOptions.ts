import GoogleProvider from 'next-auth/providers/google';
import { AuthOptions } from 'next-auth';
import DB from '@/util/db';

const db = new DB();

const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (!(await db.getUser(user.email as string))) {
        await db.createUser(user.email as string, user.name as string);
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, token, user }) {
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      return token;
    },
  },
};

export default authOptions;
