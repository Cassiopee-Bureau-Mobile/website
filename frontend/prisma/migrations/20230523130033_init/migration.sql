-- DropForeignKey
ALTER TABLE "EmailVerificationRequest" DROP CONSTRAINT "EmailVerificationRequest_userId_fkey";

-- DropForeignKey
ALTER TABLE "PasswordResetToken" DROP CONSTRAINT "PasswordResetToken_userId_fkey";

-- AddForeignKey
ALTER TABLE "EmailVerificationRequest" ADD CONSTRAINT "EmailVerificationRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
