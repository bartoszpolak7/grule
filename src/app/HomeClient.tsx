"use client";
import Link from "next/link";
import { useCart } from "@/context/cart";
import type { Game } from "@/generated/prisma/client";
import { useEffect, useState } from "react";
import PageWrapper from "@/components/PageWrapper";

interface Props {
  deals: Game[];
}

export default function HomeClient({ deals }: Readonly<Props>) {
  const { addItem, items } = useCart();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="nes-container is-dark with-title mb-12">
        <p className="title">GRULE GAMING STORE</p>
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold mb-4">
              Your PC gaming HQ awaits
            </h1>
            <p className="text-xs mb-4">
              Browse curated PC games, build your library, and checkout with
              style. Made for gamers who appreciate the grind.
            </p>
          </div>

          <div className="nes-container with-title is-rounded bg-white mb-6">
            <p className="title text-xs text-amber-600">DASHBOARD ASSET</p>
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <div className="flex h-32 w-32 items-center justify-center bg-black border-4 border-black">
                <span className="text-4xl">🎮</span>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold mb-2">
                  Drop your custom logo or spinning loading asset here
                </p>
                <p className="text-xs">Upload once ready in assets folder</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Link href="/shop/games" className="nes-btn is-primary">
              Browse Store
            </Link>
            <Link href="/library" className="nes-btn is-success">
              View Library
            </Link>
          </div>
        </div>
      </section>

      {/* Deals Section */}
      <section className="nes-container is-dark with-title">
        <p className="title">FEATURED DEALS</p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((game) => {
            const inCart = mounted && items.some((i) => i.id === game.id);
            return (
              <article
                key={game.id}
                className="nes-container is-rounded bg-white"
              >
                <Link
                  href={`/shop/games/${game.id}`}
                  className="block hover:bg-yellow-100 p-3 transition"
                >
                  <h3 className="text-xs font-bold mb-2 text-black">
                    {game.title}
                  </h3>
                  <p className="text-xs text-gray-700 mb-3">{game.genre}</p>
                  <p className="text-xs font-bold mb-3 text-green-700">
                    ${game.price.toFixed(2)}
                  </p>
                </Link>
                <button
                  onClick={() =>
                    addItem({
                      id: game.id,
                      title: game.title,
                      price: game.price,
                    })
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
      </section>
    </PageWrapper>
  );
}
