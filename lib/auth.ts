// lib/auth.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,

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
        });

        // Login in chiaro senza bcrypt (temporaneo per testing)
        if (!utente || utente.password !== credentials.password || !utente.attivo) {
          return null;
        }

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
});