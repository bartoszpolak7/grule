import { router } from "./trpc";
import { authRouter } from "./routers/auth";
import { gamesRouter } from "./routers/games";
import { ordersRouter } from "./routers/orders";

// tutaj eksportowany jest główny router aplikacji
export const appRouter = router({
  auth: authRouter,
  games: gamesRouter,
  orders: ordersRouter,
});

export type AppRouter = typeof appRouter;
