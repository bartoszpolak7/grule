import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";

export const gamesRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          genre: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      return prisma.game.findMany({
        where: input?.genre ? { genre: input.genre } : undefined,
        orderBy: { createdAt: "desc" },
      });
    }),
});
