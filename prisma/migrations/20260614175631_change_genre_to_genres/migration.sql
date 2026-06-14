/*
  Warnings:

  - You are about to drop the column `genre` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "genre",
ADD COLUMN     "genres" TEXT[];
