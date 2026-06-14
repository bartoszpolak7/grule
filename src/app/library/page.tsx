"use client";
import { useState } from "react";
import ProtectedPage from "@/components/ProtectedPage";
import { trpc } from "@/trpc/client";
import type { Game } from "@/generated/prisma/client";
import Link from "next/link";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import GameSearch from "@/components/GameSearch";
import { useGameFilters } from "@/lib/useGameFilters";

export default function LibraryPage() {
  return (
    <ProtectedPage>
      <LibraryContent />
    </ProtectedPage>
  );
}

function LibraryContent() {
  const { data: orders, isLoading, isError } = trpc.orders.list.useQuery();

  const games = Array.from(
    new Map(
      orders?.flatMap((o) => o.items.map((i) => i.game)).map((g) => [g.id, g]),
    ).values(),
  );
  const [selected, setSelected] = useState<Game | null>(null);
  const { filters, setFilters, filtered, genres } = useGameFilters(games);

  if (isLoading)
    return (
      <PageWrapper>
        <p className="text-xs nes-text is-dark"> WCZYTYWANIE BIBLIOTEKI...</p>
      </PageWrapper>
    );
  if (isError)
    return (
      <PageWrapper>
        <p className="text-xs nes-text is-error">
          NIE UDAŁO SIĘ WCZYTAĆ BIBLIOTEKI.
        </p>
      </PageWrapper>
    );

  if (games.length === 0) {
    return (
      <PageWrapper>
        <div className="nes-container is-dark with-title text-center">
          <p className="text-xs mb-4">Twoja biblioteka jest pusta!</p>
          <Link href="/shop/games" className="nes-btn is-primary text-xs">
            SZUKAJ W SKLEPIE
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <GameSearch
        filters={filters}
        onChange={setFilters}
        genres={genres}
        showPriceFilter={false} // no price filter in library
      />
      ;
      <div className="grid gap-6 lg:grid-cols-[280px_1fr] items-start">
        <aside className="nes-container is-dark with-title min-h-[50vh]">
          <p className="title text-xs">TWOJE GRY</p>
          <ul className="mt-4 space-y-2">
            {filtered.map((game) => (
              <li key={game.id}>
                <button
                  onClick={() => setSelected(game)}
                  className={`w-full text-left nes-btn text-xs ${
                    selected?.id === game.id ? "is-primary" : ""
                  }`}
                >
                  {game.title}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="nes-container is-dark with-title min-h-[50vh]">
          <p className="title text-xs">SZCZEGÓŁY</p>
          {selected ? (
            <GameDetail game={selected} />
          ) : (
            <div className="flex min-h-[40vh] items-center justify-center text-center">
              <p className="text-xs">Wybierz grę, aby zobaczyć jej opis.</p>
            </div>
          )}
        </section>
      </div>
    </PageWrapper>
  );
}

function GameDetail({ game }: { game: Game }) {
  return (
    <div className="space-y-4">
      {game.imageUrl && (
        <div className="border-2 border-black bg-black overflow-hidden">
          <Image
            src={game.imageUrl}
            alt={game.title}
            width={800}
            height={400}
            className="w-full h-48 object-cover"
            style={{ imageRendering: "pixelated" }}
          />
        </div>
      )}
      <div>
        <h1 className="text-lg font-bold mb-1">{game.title}</h1>
        <p className="text-xs mb-3">{game.genre}</p>
        <p className="text-xs leading-5">{game.description}</p>
      </div>
    </div>
  );
}
