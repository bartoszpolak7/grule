"use client";
import { useCart } from "@/context/cart";
import Link from "next/link";
import type { Game } from "@/generated/prisma/client";

interface Props {
  games: Game[];
}

export default function GameListClient({ games }: Readonly<Props>) {
  const { addItem, items } = useCart();

  if (!games.length) return <p>No games available.</p>;

  return (
    <main>
      <h1>Store</h1>
      <ul>
        {games.map((game) => {
          const inCart = items.some((i) => i.id === game.id);
          return (
            <li key={game.id}>
              <Link href={`/shop/games/${game.id}`}>
                <h2>{game.title}</h2>
              </Link>
              <p>{game.genre}</p>
              <p>${game.price.toFixed(2)}</p>
              <button
                onClick={() =>
                  addItem({ id: game.id, title: game.title, price: game.price })
                }
                disabled={inCart}
              >
                {inCart ? "In cart" : "Add to cart"}
              </button>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
