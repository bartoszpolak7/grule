"use client";
import Link from "next/link";
import { useCart } from "@/context/cart";
import { useOwnedGames } from "@/lib/useOwnedGames";
import type { Game } from "@/generated/prisma/client";

interface Props {
  game: Game;
  mounted: boolean;
}

export default function GameCard({ game, mounted }: Readonly<Props>) {
  const { addItem, items } = useCart();
  const owned = useOwnedGames();

  const inCart = mounted && items.some((i) => i.id === game.id);
  const isOwned = mounted && owned.has(game.id);

  const buttonLabel = () => {
    if (isOwned) return "W BIBLIOTECE";
    if (inCart) return "W KOSZYKU";
    return "DODAJ DO KOSZYKA";
  };

  const buttonClass = () => {
    if (isOwned) return "is-disabled";
    if (inCart) return "is-warning";
    return "is-success";
  };

  return (
    <article className="nes-container is-rounded bg-white">
      <Link
        href={`/shop/games/${game.id}`}
        className="block hover:bg-yellow-100 p-3 transition"
      >
        <h3 className="text-xs font-bold mb-2 text-black">{game.title}</h3>
        <p className="text-xs text-gray-700 mb-1">{game.genre}</p>
        <p className="text-xs font-bold text-green-700">
          ${game.price.toFixed(2)}
        </p>
      </Link>
      <button
        onClick={() =>
          addItem({ id: game.id, title: game.title, price: game.price })
        }
        disabled={isOwned || inCart}
        className={`nes-btn w-full text-xs ${buttonClass()}`}
      >
        {buttonLabel()}
      </button>
    </article>
  );
}
