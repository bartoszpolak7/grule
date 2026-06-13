import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/server/index";
import superjson from "superjson";

export const trpcServer = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/trpc`,
      transformer: superjson,
    }),
  ],
});
