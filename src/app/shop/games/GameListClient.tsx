"use client";
import { useEffect, useState } from "react";
import type { Game } from "@/generated/prisma/client";
import { useGameFilters } from "@/lib/useGameFilters";
import PageWrapper from "@/components/PageWrapper";
import GameSearch from "@/components/GameSearch";
import GameCard from "@/components/GameCard";

interface Props {
  games: Game[];
}

export default function GamesListClient({ games }: Readonly<Props>) {
  const [mounted, setMounted] = useState(false);
  const { filters, setFilters, filtered, genres } = useGameFilters(games);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!games.length)
    return (
      <PageWrapper>
        <div className="nes-container is-dark">
          <p className="text-center text-xs">
            Nie mamy na razie żadnych gier :(
          </p>
        </div>
      </PageWrapper>
    );

  return (
    <PageWrapper>
      <GameSearch
        filters={filters}
        onChange={setFilters}
        genres={genres}
        showPriceFilter={true}
      />
      {filtered.length === 0 && (
        <p className="text-xs text-center mt-8">NIE MA TAKIEJ GRY.</p>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((game) => (
          <GameCard key={game.id} game={game} mounted={mounted} />
        ))}
      </div>
    </PageWrapper>
  );
}
