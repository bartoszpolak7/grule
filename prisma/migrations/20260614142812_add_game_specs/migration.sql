/*
  Warnings:

  - A unique constraint covering the columns `[rawgId]` on the table `Game` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "minOs" TEXT,
ADD COLUMN     "minRamGb" INTEGER,
ADD COLUMN     "minStorageGb" INTEGER,
ADD COLUMN     "rawgId" INTEGER,
ADD COLUMN     "requiresGpu" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Game_rawgId_key" ON "Game"("rawgId");
