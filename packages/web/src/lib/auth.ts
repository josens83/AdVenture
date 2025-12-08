import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import bcrypt from 'bcryptjs';
import prisma from './prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),

    // GitHub OAuth
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),

    // Email/Password
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('이메일과 비밀번호를 입력해주세요.');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.hashedPassword) {
          throw new Error('등록되지 않은 이메일입니다.');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isPasswordValid) {
          throw new Error('비밀번호가 일치하지 않습니다.');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;

        // Get subscription info
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            subscription: true,
            subscriptionEnd: true,
          },
        });

        if (dbUser) {
          token.subscription = dbUser.subscription;
          token.subscriptionEnd = dbUser.subscriptionEnd;
        }
      }

      // Handle session update
      if (trigger === 'update' && session) {
        token.name = session.name;
        token.subscription = session.subscription;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.subscription = token.subscription as string;
        session.user.subscriptionEnd = token.subscriptionEnd as Date | null;
      }
      return session;
    },

    async signIn({ user, account }) {
      // Allow OAuth sign in
      if (account?.provider !== 'credentials') {
        return true;
      }

      // For credentials, check if user exists
      if (!user.email) {
        return false;
      }

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!existingUser) {
        return false;
      }

      return true;
    },
  },

  events: {
    async createUser({ user }) {
      // Initialize user data when account is created
      if (user.id) {
        // Create initial leaderboard entry
        await prisma.leaderboardEntry.create({
          data: {
            userId: user.id,
          },
        });

        // Log analytics event
        await prisma.userAnalytics.create({
          data: {
            userId: user.id,
            eventType: 'user_created',
            eventData: {
              provider: 'oauth',
            },
          },
        });
      }
    },

    async signIn({ user, account }) {
      if (user.id) {
        await prisma.userAnalytics.create({
          data: {
            userId: user.id,
            eventType: 'user_signin',
            eventData: {
              provider: account?.provider,
            },
          },
        });
      }
    },
  },

  debug: process.env.NODE_ENV === 'development',
};
