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
    <main>
      <h1>{game.title}</h1>
      <p>{game.genre}</p>
      <p>${game.price.toFixed(2)}</p>
      <p>{game.description}</p>
      {game.imageUrl && (
        <Image
          src={game.imageUrl}
          alt={game.title}
          style={{ maxWidth: "400px" }}
        />
      )}
      <button onClick={handleAdd} disabled={inCart}>
        {inCart ? "Already in cart" : "Add to cart"}
      </button>
    </main>
  );
}
