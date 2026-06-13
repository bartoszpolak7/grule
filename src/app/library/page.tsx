// src/app/library/page.tsx
"use client";
import { useState } from "react";
import ProtectedPage from "@/components/ProtectedPage";
import { trpc } from "@/trpc/client";
import type { Game } from "@/generated/prisma/client";
import Link from "next/link";
import Image from "next/image";

export default function LibraryPage() {
  return (
    <ProtectedPage>
      <LibraryContent />
    </ProtectedPage>
  );
}

function LibraryContent() {
  const { data: orders, isLoading, isError } = trpc.orders.list.useQuery();
  const [selected, setSelected] = useState<Game | null>(null);

  if (isLoading) return <p>Loading your library...</p>;
  if (isError) return <p>Failed to load library.</p>;

  const games = Array.from(
    new Map(
      orders?.flatMap((o) => o.items.map((i) => i.game)).map((g) => [g.id, g]),
    ).values(),
  );

  if (games.length === 0) {
    return (
      <main>
        <h1>Your Library</h1>
        <p>
          No games yet. <Link href="/shop/games">Browse the store.</Link>
        </p>
      </main>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 3.5rem)",
      }}
    >
      {/* Left panel — game list */}
      <aside
        style={{
          width: "280px",
          borderRight: "1px solid #333",
          overflowY: "auto",
          padding: "1rem",
          flexShrink: 0,
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>Your Games</h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {games.map((game) => (
            <li
              key={game.id}
              onClick={() => setSelected(game)}
              style={{
                padding: "0.75rem",
                cursor: "pointer",
                borderRadius: "4px",
                backgroundColor:
                  selected?.id === game.id ? "#222" : "transparent",
                marginBottom: "0.25rem",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontWeight: selected?.id === game.id ? "bold" : "normal",
                }}
              >
                {game.title}
              </p>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#888" }}>
                {game.genre}
              </p>
            </li>
          ))}
        </ul>
      </aside>

      {/* Centre panel — game details */}
      <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        {selected ? (
          <GameDetail game={selected} />
        ) : (
          <div
            style={{ color: "#888", marginTop: "4rem", textAlign: "center" }}
          >
            <p>Select a game from your library to view details.</p>
          </div>
        )}
      </main>
    </div>
  );
}

function GameDetail({ game }: { game: Game }) {
  return (
    <div>
      {game.imageUrl && (
        <Image
          src={game.imageUrl}
          alt={game.title}
          style={{
            width: "100%",
            maxWidth: "400px",
            borderRadius: "8px",
            marginBottom: "1rem",
          }}
        />
      )}
      <h1>{game.title}</h1>
      <p style={{ color: "#888" }}>{game.genre}</p>
      <p style={{ marginTop: "1rem" }}>{game.description}</p>
    </div>
  );
}
