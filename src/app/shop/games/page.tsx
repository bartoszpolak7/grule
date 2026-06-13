import Link from 'next/link'
import { trpcServer } from '@/trpc/server'

// żeby Next nie prerenderował tej strony na etapie build image
export const dynamic = 'force-dynamic'

export default async function GamesPage() {
  const games = await trpcServer.games.list.query()

  return (
    <main>
      <h1>Store</h1>
      {games.length === 0 && (
        <p>No games yet. Run the seed script to populate the store with sample data.</p>
      )}
      <ul>
        {games.map((game) => (
          <li key={game.id}>
            <Link href={`/games/${game.id}`}>
              <h2>{game.title}</h2>
              <p>{game.genre}</p>
              <p>${game.price.toFixed(2)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}