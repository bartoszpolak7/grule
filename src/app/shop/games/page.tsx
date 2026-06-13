import { trpcServer } from "@/trpc/server";
import GameListClient from "./GameListClient";

export const dynamic = "force-dynamic";

export default async function GamesPage() {
  const games = await trpcServer.games.list.query();
  return <GameListClient games={games} />;
}
