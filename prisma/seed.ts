import { prisma } from "../src/lib/prisma";

// skrypt seedujący, uruchamianie:

const games = [
  {
    rawgId: 422,
    title: "Terraria",
    price: 9.99,
    genres: ["Action", "Adventure"],
  },
  {
    rawgId: 3328,
    title: "The Witcher 3",
    price: 39.99,
    genres: ["RPG", "Action"],
  },
  {
    rawgId: 4200,
    title: "Portal 2",
    price: 9.99,
    genres: ["Puzzle", "Action"],
  },
  {
    rawgId: 713,
    title: "Stardew Valley",
    price: 14.99,
    genres: ["RPG", "Simulation"],
  },
  {
    rawgId: 12020,
    title: "Left 4 Dead 2",
    price: 9.99,
    genres: ["Action", "Shooter"],
  },
  {
    rawgId: 328487,
    title: "Celeste",
    price: 19.99,
    genres: ["Platformer", "Indie"],
  },
  {
    rawgId: 27370,
    title: "Hollow Knight",
    price: 14.99,
    genres: ["Action", "Indie"],
  },
  {
    rawgId: 416078,
    title: "Among Us",
    price: 4.99,
    genres: ["Strategy", "Indie"],
  },
];

async function main() {
  for (const game of games) {
    await prisma.game.upsert({
      where: { title: game.title },
      update: { price: game.price, rawgId: game.rawgId, genres: game.genres },
      create: {
        ...game,
        description: "Loading from RAWG...",
        imageUrl: null,
      },
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
