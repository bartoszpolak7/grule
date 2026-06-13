import { initTRPC, TRPCError } from "@trpc/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

// tutaj tworzony jest kontekst TRPC

export const createTRPCContext = async () => {
  return {
    cookies: await cookies(),
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create();

export const router = t.router;

// publicznie i chronione procedury do wykorzystania w routes

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  const token = ctx.cookies.get("access_token")?.value;
  if (!token) throw new TRPCError({ code: "UNAUTHORIZED" });

  const payload = verifyToken(token);
  if (!payload) throw new TRPCError({ code: "UNAUTHORIZED" });

  return next({ ctx: { ...ctx, userId: payload.userId } });
});
