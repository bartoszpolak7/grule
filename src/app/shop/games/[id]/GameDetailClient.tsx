"use client";
import { useCart } from "@/context/cart";
import { useRouter } from "next/navigation";
import type { Game } from "@/generated/prisma/client";
import Image from "next/image";

interface Props {
  game: Game;
}

export default function GameDetailClient({ game }: Readonly<Props>) {
  const { addItem, items } = useCart();
  const router = useRouter();

  const inCart = items.some((i) => i.id === game.id);

  const handleAdd = () => {
    addItem({ id: game.id, title: game.title, price: game.price });
    router.push("/cart");
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <section className="nes-container is-dark with-title">
          <p className="title text-xs">GAME DETAIL</p>
          <div className="mb-4">
            <h1 className="text-xl font-bold mb-2">{game.title}</h1>
            <p className="text-xs mb-4">{game.genre}</p>
            <p className="text-xs leading-5">{game.description}</p>
          </div>
        </section>

        <aside className="nes-container is-dark with-title">
          <p className="title text-xs">PURCHASE</p>
          {game.imageUrl ? (
            <div className="mb-4 border-2 border-black bg-black overflow-hidden">
              <Image
                src={game.imageUrl}
                alt={game.title}
                width={320}
                height={200}
                className="w-full h-40 object-cover"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center border-2 border-black bg-gray-300 mb-4 text-xs font-bold">
              NO PREVIEW
            </div>
          )}

          <div className="space-y-3">
            <p className="text-xs font-bold text-green-700 mb-3">
              ${game.price.toFixed(2)}
            </p>
            <button
              type="button"
              onClick={handleAdd}
              disabled={inCart}
              className={`w-full nes-btn text-xs ${inCart ? "is-disabled" : "is-success"}`}
            >
              {inCart ? "IN CART" : "ADD TO CART"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/shop/games")}
              className="w-full nes-btn text-xs"
            >
              BACK
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
