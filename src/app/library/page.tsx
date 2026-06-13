"use client";
import ProtectedPage from "@/components/ProtectedPage";
import { trpc } from "@/trpc/client";

export default function LibraryPage() {
  return (
    <ProtectedPage>
      <LibraryContent />
    </ProtectedPage>
  );
}

function LibraryContent() {
  const { data: orders, isLoading, isError } = trpc.orders.list.useQuery();

  if (isLoading) return <p>Loading your library...</p>;
  if (isError) return <p>Failed to load library.</p>;

  const games = orders?.flatMap((order) =>
    order.items.map((item) => item.game),
  );

  // jeśli z jakiegoś powodu gra została kupiona, zebrać unikaty
  const unique = Array.from(new Map(games?.map((g) => [g.id, g])).values());

  if (unique.length === 0) {
    return (
      <main>
        <h1>Your Library</h1>
        <p>You haven&apos;t purchased any games yet.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Your Library</h1>
      <ul>
        {unique.map((game) => (
          <li key={game.id}>
            <h2>{game.title}</h2>
            <p>{game.genre}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
