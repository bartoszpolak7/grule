import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { prisma } from "../../lib/prisma";
import { TRPCError } from "@trpc/server";

export const ordersRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            gameId: z.string(),
            price: z.number(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.items.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Cart is empty" });
      }

      const totalPrice = input.items.reduce((sum, item) => sum + item.price, 0);

      const order = await prisma.order.create({
        data: {
          userId: ctx.userId,
          totalPrice,
          items: {
            create: input.items.map((item) => ({
              gameId: item.gameId,
              price: item.price,
            })),
          },
        },
        include: { items: true },
      });

      return order;
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    return prisma.order.findMany({
      where: { userId: ctx.userId },
      include: {
        items: {
          include: { game: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }),
});
