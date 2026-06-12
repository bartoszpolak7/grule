import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import {
  hashPassword,
  comparePassword,
  signAccessToken,
  signRefreshToken,
  verifyToken,
} from "@/lib/auth";

export const authRouter = router({
  // rejestracja
  register: publicProcedure
    .input(
      z.object({
        email: z.email(),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    )
    .mutation(async ({ input }) => {
      const existing = await prisma.user.findUnique({
        where: { email: input.email },
      });
      if (existing)
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already in use",
        });

      const hashed = await hashPassword(input.password);
      const user = await prisma.user.create({
        data: { email: input.email, password: hashed },
      });

      const accessToken = signAccessToken(user.id);
      const refreshToken = signRefreshToken(user.id);

      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      const cookieStore = await cookies();
      cookieStore.set("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });

      return { accessToken, email: user.email };
    }),

  // logowanie
  login: publicProcedure
    .input(
      z.object({
        email: z.email(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { email: input.email },
      });
      if (!user)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        });

      const valid = await comparePassword(input.password, user.password);
      if (!valid)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        });

      const accessToken = signAccessToken(user.id);
      const refreshToken = signRefreshToken(user.id);

      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      const cookieStore = await cookies();
      cookieStore.set("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });

      return { accessToken, email: user.email };
    }),

  // odświeżanie
  refresh: publicProcedure.mutation(async () => {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;
    if (!refreshToken) throw new TRPCError({ code: "UNAUTHORIZED" });

    const payload = verifyToken(refreshToken);
    if (!payload) throw new TRPCError({ code: "UNAUTHORIZED" });

    const stored = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });
    if (!stored || stored.expiresAt < new Date()) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const accessToken = signAccessToken(payload.userId);
    return { accessToken };
  }),

  // wylogowywanie
  logout: protectedProcedure.mutation(async () => {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });
      cookieStore.delete("refresh_token");
    }

    return { success: true };
  }),
});
