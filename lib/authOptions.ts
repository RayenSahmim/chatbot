import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
    clientSecret: process.env.GITHUB_SECRET!,
    authorization: {
        params: {
          scope: 'read:user user:email'
        }
      }
    }),
  ],
  pages: {
    signIn: '/Login',  // Custom sign-in page (optional)
  },
  secret: process.env.NEXTAUTH_SECRET,
  session:{
    strategy: "jwt",
    maxAge: 60 * 60 * 6,
},
jwt: {
    maxAge: 60 * 60 * 10
},

  callbacks: {
    async session({ session }) {
      return session;
    },
    async jwt({ token }) {
      return token;
    },
  },
}

export default NextAuth(authOptions)
