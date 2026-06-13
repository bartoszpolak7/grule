import { router } from "./trpc";
import { authRouter } from "./routers/auth";
import { gamesRouter } from "./routers/games";

// tutaj eksportowany jest główny router aplikacji
export const appRouter = router({
  auth: authRouter,
  games: gamesRouter,
});

export type AppRouter = typeof appRouter;
