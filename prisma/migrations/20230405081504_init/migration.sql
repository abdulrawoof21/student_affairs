/*
  Warnings:

  - You are about to drop the column `privilegeId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_privilegeId_fkey";

-- AlterTable
ALTER TABLE "Privileges" ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "privilegeId";

-- AddForeignKey
ALTER TABLE "Privileges" ADD CONSTRAINT "Privileges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
