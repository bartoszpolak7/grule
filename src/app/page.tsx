import { trpcServer } from "@/trpc/server";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const deals = await trpcServer.games.bestDeals.query();
  return <HomeClient deals={deals} />;
}
