import { prisma } from "../src/lib/prisma";

// skrypt seedujący, uruchamianie:

const games = [
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
];

// funkcja, która sprawdza czy tytuł już znajduje się w bibliotece
async function main() {
  for (const game of games) {
    await prisma.game.upsert({
      where: { title: game.title },
      update: {},
      create: game,
    });
  }
  console.log("Seed complete");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
