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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

      <div className="grid gap-6 lg:grid-cols-[1fr_200px]">
        {/* Games grid */}
        <div>
          {filtered.length === 0 && (
            <p className="text-xs text-center mt-8">NIE MA TAKIEJ GRY.</p>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((game) => (
              <GameCard key={game.id} game={game} mounted={mounted} />
            ))}
          </div>
        </div>

        {/* Gatunki panel */}
        <aside className="nes-container is-dark with-title h-fit">
          <p className="title text-xs">GATUNKI</p>
          <ul className="space-y-2 mt-2">
            {genres.map((genre) => (
              <li key={genre}>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    className="nes-checkbox is-dark"
                    checked={filters.selectedGenres.has(genre)}
                    onChange={() => {
                      const next = new Set(filters.selectedGenres);
                      next.has(genre) ? next.delete(genre) : next.add(genre);
                      setFilters({ ...filters, selectedGenres: next });
                    }}
                  />

                  <span>{genre}</span>
                </label>
              </li>
            ))}
          </ul>
          {filters.selectedGenres.size > 0 && (
            <button
              className="nes-btn is-error text-xs w-full mt-4"
              onClick={() =>
                setFilters({ ...filters, selectedGenres: new Set() })
              }
            >
              WYCZYŚĆ
            </button>
          )}
        </aside>
      </div>
    </PageWrapper>
  );
}
