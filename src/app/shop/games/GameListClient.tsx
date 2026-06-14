"use client";
import { useCart } from "@/context/cart";
import Link from "next/link";
import type { Game } from "@/generated/prisma/client";
import { useEffect, useState } from "react";
import { useGameFilters } from "@/lib/useGameFilters";
import PageWrapper from "@/components/PageWrapper";
import GameSearch from "@/components/GameSearch";

interface Props {
  games: Game[];
}

export default function GameListClient({ games }: Readonly<Props>) {
  const { addItem, items } = useCart();

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
            Nie mamy na razie żadnych gier :&#40;
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
        {filtered.map((game) => {
          const inCart = mounted && items.some((i) => i.id === game.id);
          return (
            <article
              key={game.id}
              className="nes-container is-rounded bg-white"
            >
              <Link href={`/shop/games/${game.id}`} className="block p-3">
                <h2 className="text-xs font-bold mb-1 text-black">
                  {game.title}
                </h2>
                <p className="text-xs text-gray-600 mb-1">{game.genre}</p>
                <p className="text-xs font-bold text-green-700">
                  ${game.price.toFixed(2)}
                </p>
              </Link>
              <button
                onClick={() =>
                  addItem({ id: game.id, title: game.title, price: game.price })
                }
                disabled={inCart}
                className={`nes-btn w-full text-xs ${inCart ? "is-disabled" : "is-success"}`}
              >
                {inCart ? "IN CART" : "ADD TO CART"}
              </button>
            </article>
          );
        })}
      </div>
    </PageWrapper>
  );
}
