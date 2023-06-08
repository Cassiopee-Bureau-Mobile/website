/*
  Warnings:

  - A unique constraint covering the columns `[emailVerifyToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `firstName` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `Profile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "firstName" SET NOT NULL,
ALTER COLUMN "lastName" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerifyToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_emailVerifyToken_key" ON "User"("emailVerifyToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_username_key" ON "User"("email", "username");
