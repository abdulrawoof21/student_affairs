/*
  Warnings:

  - You are about to drop the column `userId` on the `Privileges` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Privileges" DROP CONSTRAINT "Privileges_userId_fkey";

-- AlterTable
ALTER TABLE "Privileges" DROP COLUMN "userId";
