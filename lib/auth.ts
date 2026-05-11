// lib/auth.ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
      name: "Email e Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const utente = await prisma.utente.findUnique({
          where: { email: credentials.email as string },
          include: { scuola: true },
        });

        if (!utente || !utente.password || !utente.attivo) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          utente.password
        );
        if (!valid) return null;

        return {
          id: utente.id,
          email: utente.email,
          name: `${utente.nome} ${utente.cognome}`,
          ruolo: utente.ruolo,
          sede: utente.sede,
          scuolaId: utente.scuolaId,
        };
      },
    }),

    ...(process.env.GOOGLE_CLIENT_ID
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),

    ...(process.env.GITHUB_CLIENT_ID
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
          }),
        ]
      : []),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.ruolo = (user as any).ruolo;
        token.sede = (user as any).sede;
        token.scuolaId = (user as any).scuolaId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).ruolo = token.ruolo;
        (session.user as any).sede = token.sede;
        (session.user as any).scuolaId = token.scuolaId;
      }
      return session;
    },
  },

  pages: {
  signIn: "/login",
  error: "/login",
},
callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.ruolo = (user as any).ruolo;
      token.sede = (user as any).sede;
      token.scuolaId = (user as any).scuolaId;
    }
    return token;
  },
  async session({ session, token }) {
    if (session.user) {
      (session.user as any).id = token.sub;
      (session.user as any).ruolo = token.ruolo;
      (session.user as any).sede = token.sede;
      (session.user as any).scuolaId = token.scuolaId;
    }
    return session;
  },
},
});
