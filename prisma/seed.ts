import { prisma } from "../src/lib/prisma";

// skrypt seedujący, uruchamianie:

// DATABASE_URL="postgresql://postgres:postgres@localhost:5432/grule" npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts

async function main() {
  await prisma.game.createMany({
    data: [
      {
        title: "Potato Quest",
        description: "An epic adventure for low-end PCs.",
        price: 4.99,
        genre: "RPG",
      },
      {
        title: "Minesweeper Deluxe",
        description: "The classic, reimagined.",
        price: 1.99,
        genre: "Puzzle",
      },
      {
        title: "Budget Racer",
        description: "Race on integrated graphics.",
        price: 2.99,
        genre: "Racing",
      },
      {
        title: "Pixel Dungeon",
        description: "Roguelike for the frugal gamer.",
        price: 3.99,
        genre: "Roguelike",
      },
      {
        title: "Farm Simulator Lite",
        description: "Grow crops on 512MB RAM.",
        price: 0.99,
        genre: "Simulation",
      },
    ],
  });
  console.log("Seeded 5 games");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
