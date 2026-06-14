import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";
import { EnrichedGame } from "@/lib/types";
import { TRPCError } from "@trpc/server";
import { getRawgGame } from "@/lib/rawg";

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
    .query(async ({ input }): Promise<EnrichedGame> => {
      const game = await prisma.game.findUnique({ where: { id: input.id } });
      if (!game) throw new TRPCError({ code: "NOT_FOUND" });
      if (!game.rawgId) return game;

      const rawg = await getRawgGame(game.rawgId);
      if (!rawg) return game;

      // załaduj dane do bazy danych jeśli jeszcze ich tam nie ma
      if (!game.minRamGb && !game.minStorageGb) {
        await prisma.game.update({
          where: { id: game.id },
          data: {
            minRamGb: rawg.specs.minRamGb,
            minStorageGb: rawg.specs.minStorageGb,
            requiresGpu: rawg.specs.requiresGpu,
            minOs: rawg.specs.minOs,
            imageUrl: rawg.imageUrl ?? game.imageUrl,
            genre: rawg.genre ?? game.genre,
          },
        });
      }

      return {
        ...game,
        genre: rawg.genre ?? game.genre,
        imageUrl: rawg.imageUrl ?? game.imageUrl,
        rawgRating: rawg.rating,
        rawgDescription: rawg.description,
        rawgMetacritic: rawg.metacritic,
        rawgScreenshots: rawg.screenshots,
        rawgSpecs: rawg.specs,
      };
    }),

  bestDeals: publicProcedure.query(async () => {
    return prisma.game.findMany({
      orderBy: { price: "asc" },
      take: 4,
    });
  }),
});
