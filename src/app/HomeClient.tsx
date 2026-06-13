"use client";
import Link from "next/link";
import { useCart } from "@/context/cart";
import type { Game } from "@/generated/prisma/client";

interface Props {
  deals: Game[];
}

export default function HomeClient({ deals }: Readonly<Props>) {
  const { addItem, items } = useCart();

  return (
    <main>
      {/* Hero */}
      <section>
        <h1>Grule</h1>
        <p>The only store for potato PC gamers.</p>
        <Link href="/shop/games">Browse all games</Link>
      </section>

      {/* Promocje */}
      <section>
        <h2>Best deals</h2>
        <ul>
          {deals.map((game) => {
            const inCart = items.some((i) => i.id === game.id);
            return (
              <li key={game.id}>
                <Link href={`/shop/games/${game.id}`}>
                  <h3>{game.title}</h3>
                </Link>
                <p>{game.genre}</p>
                <p>${game.price.toFixed(2)}</p>
                <button
                  onClick={() =>
                    addItem({
                      id: game.id,
                      title: game.title,
                      price: game.price,
                    })
                  }
                  disabled={inCart}
                >
                  {inCart ? "In cart" : "Add to cart"}
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
