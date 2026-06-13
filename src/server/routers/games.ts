import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";

export const gamesRouter = router({
  list: publicProcedure
    .input(z.object({ genre: z.string().optional() }).optional())
    .query(async ({ input }) => {
      return prisma.game.findMany({
        where: input?.genre ? { genre: input.genre } : undefined,
        orderBy: { createdAt: "desc" },
      });
    }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const game = await prisma.game.findUnique({
        where: { id: input.id },
      });
      if (!game) throw new Error("Game not found");
      return game;
    }),

  bestDeals: publicProcedure.query(async () => {
    return prisma.game.findMany({
      orderBy: { price: "asc" },
      take: 4,
    });
  }),
});
