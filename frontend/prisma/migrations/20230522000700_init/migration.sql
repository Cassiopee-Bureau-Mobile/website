/*
  Warnings:

  - The primary key for the `Profile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerifyToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "User_emailVerifyToken_key";

-- AlterTable
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_pkey",
DROP COLUMN "id";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerifyToken";

-- DropTable
DROP TABLE "VerificationToken";

-- CreateTable
CREATE TABLE "EmailVerificationRequest" (
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerificationRequest_userId_key" ON "EmailVerificationRequest"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerificationRequest_token_key" ON "EmailVerificationRequest"("token");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_userId_key" ON "PasswordResetToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_userId_token_key" ON "PasswordResetToken"("userId", "token");

-- AddForeignKey
ALTER TABLE "EmailVerificationRequest" ADD CONSTRAINT "EmailVerificationRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
