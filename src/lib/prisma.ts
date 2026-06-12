import { PrismaClient } from "@prisma/client/extension";

// definiuje jednego klienta dla developmentu, aby nie tworzyć za każdym razem nowego
// w przypadku Hot Module Reload

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
