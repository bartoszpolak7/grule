"use client";
import Link from "next/link";
import type { Game } from "@/generated/prisma/client";
import { useEffect, useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import GameCard from "@/components/GameCard";
import Image from "next/image";
import gruleImg from "@/../public/grule_title.png";

interface Props {
  deals: Game[];
}

export default function HomeClient({ deals }: Readonly<Props>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <PageWrapper>
      {/* HERO SEKCJA */}
      <section className="nes-container is-dark with-title mb-12">
        <div className="flex flex-col gap-6">
          <div className="flex justify-center">
            <h1 className="text-2xl font-bold mb-4">
              Wykopki najlepszych gier
            </h1>
          </div>

          <div className="flex justify-center">
            <Image src={gruleImg} alt="Big logo"></Image>
          </div>

          <div className="flex justify-center">
            <p className="text-xs mb-4">
              Jeśli komputer znalazłeś wykrywaczem, znajdziesz tu gry dla
              siebie.
            </p>
          </div>

          <div className="flex gap-3 flex-wrap justify-center">
            <Link href="/shop/games" className="nes-btn is-primary">
              Przeglądaj gry
            </Link>
            <Link href="/library" className="nes-btn is-success">
              Bilbioteka
            </Link>
          </div>
        </div>
      </section>

      {/* SEKCJA OFERT */}
      <section className="nes-container is-dark with-title">
        <p className="title">NAJLEPSZE OFERTY</p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((game) => (
            <GameCard key={game.id} game={game} mounted={mounted} />
          ))}
        </div>
      </section>
    </PageWrapper>
  );
}
