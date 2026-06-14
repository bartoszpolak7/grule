"use client";
import { useCart } from "@/context/cart";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { EnrichedGame } from "@/lib/types";
import PageWrapper from "@/components/PageWrapper";

interface Props {
  game: EnrichedGame;
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
    <PageWrapper>
      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <section className="nes-container is-dark with-title">
          <p className="title text-xs">SZCZEGÓŁY GRY</p>
          <div className="mb-4">
            <h1 className="text-xl font-bold mb-2">{game.title}</h1>
            <p className="text-xs mb-4">{game.genres.join(", ")}</p>

            {game.rawgRating && (
              <p className="text-xs mb-2">
                ⭐ {game.rawgRating.toFixed(1)} / 5
              </p>
            )}
            {game.rawgMetacritic && (
              <p className="text-xs mb-4">
                🎮 Metacritic: {game.rawgMetacritic}
              </p>
            )}
            <p className="text-xs leading-5">
              {game.description ?? game.rawgDescription}
            </p>
            {game.rawgScreenshots && game.rawgScreenshots.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {game.rawgScreenshots.slice(0, 4).map((url, i) => (
                  <div
                    key={i}
                    className="border-2 border-black overflow-hidden"
                  >
                    <Image
                      src={url}
                      alt={`${game.title} screenshot ${i + 1}`}
                      width={400}
                      height={225}
                      className="w-full h-24 object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <aside className="nes-container is-dark with-title">
          <p className="title text-xs">KUP</p>
          {game.imageUrl ? (
            <div className="mb-4 border-2 border-black bg-black overflow-hidden">
              <Image
                src={game.imageUrl}
                alt={game.title}
                width={320}
                height={200}
                className="w-full h-40 object-cover"
              />
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center border-2 border-black bg-gray-300 mb-4 text-xs font-bold">
              BRAK PODGLĄDU
            </div>
          )}

          <div className="space-y-3 mb-6">
            <p className="text-xs font-bold text-green-700">
              ${game.price.toFixed(2)}
            </p>
            <button
              type="button"
              onClick={handleAdd}
              disabled={inCart}
              className={`w-full nes-btn text-xs ${inCart ? "is-disabled" : "is-success"}`}
            >
              {inCart ? "W KOSZYKU" : "DODAJ DO KOSZYKA"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/shop/games")}
              className="w-full nes-btn text-xs"
            >
              WSTECZ
            </button>
          </div>

          {/* Specyfikacja */}
          <div className="nes-container is-rounded with-title">
            <ul className="space-y-2 mt-2">
              <li className="text-xs">
                🖥 OS:{" "}
                {game.rawgSpecs?.minOs ?? game.minOs ?? "Brak informacji"}
              </li>
              <li className="text-xs">
                🧠 RAM:{" "}
                {(game.rawgSpecs?.minRamGb ?? game.minRamGb)
                  ? `${game.rawgSpecs?.minRamGb ?? game.minRamGb}GB minimum`
                  : "Brak informacji"}
              </li>
              <li className="text-xs">
                💾 Dysk:{" "}
                {(game.rawgSpecs?.minStorageGb ?? game.minStorageGb)
                  ? `${game.rawgSpecs?.minStorageGb ?? game.minStorageGb}GB`
                  : "Brak informacji"}
              </li>
              <li className="text-xs">
                🎮 GPU:{" "}
                {game.rawgSpecs
                  ? game.rawgSpecs.requiresGpu
                    ? "Wymagana dedykowana karta graficzna"
                    : "✅ Działa na zintegrowanej grafice"
                  : game.requiresGpu
                    ? "Wymagana dedykowana karta graficzna"
                    : "✅ Działa na zintegrowanej grafice"}
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </PageWrapper>
  );
}
