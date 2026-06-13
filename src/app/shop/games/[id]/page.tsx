import { trpcServer } from "@/trpc/server";
import GameDetailClient from "./GameDetailClient";

export const dynamic = "force-dynamic";

// serwerowa część tej strony zajmuje się pobieraniem informacji

interface Props {
  params: Promise<{ id: string }>;
}

export default async function GameDetailPage({ params }: Readonly<Props>) {
  const { id } = await params;
  const game = await trpcServer.games.byId.query({ id });

  return <GameDetailClient game={game} />;
}
