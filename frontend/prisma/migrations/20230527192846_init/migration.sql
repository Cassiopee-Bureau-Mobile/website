/*
  Warnings:

  - You are about to drop the column `jupyterHubServiceId` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `openVPNServiceId` on the `Profile` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('JUPYTERHUB', 'OPENVPN');

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_jupyterHubServiceId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_openVPNServiceId_fkey";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "jupyterHubServiceId",
DROP COLUMN "openVPNServiceId";

-- CreateTable
CREATE TABLE "ServiceRegistration" (
    "id" TEXT NOT NULL,
    "name" "ServiceType" NOT NULL,
    "profileUserId" TEXT NOT NULL,
    "jupyterHubServiceId" TEXT,
    "openVPNServiceId" TEXT,

    CONSTRAINT "ServiceRegistration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ServiceRegistration" ADD CONSTRAINT "ServiceRegistration_profileUserId_fkey" FOREIGN KEY ("profileUserId") REFERENCES "Profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRegistration" ADD CONSTRAINT "ServiceRegistration_jupyterHubServiceId_fkey" FOREIGN KEY ("jupyterHubServiceId") REFERENCES "JupyterHubService"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRegistration" ADD CONSTRAINT "ServiceRegistration_openVPNServiceId_fkey" FOREIGN KEY ("openVPNServiceId") REFERENCES "OpenVPNService"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Add CheckConstraint
ALTER TABLE "ServiceRegistration" ADD CONSTRAINT "ServiceRegistration_check_jupyterhub_openvpn" CHECK (
    (name = 'OPENVPN' AND "jupyterHubServiceId" IS NULL) OR
    (name = 'JUPYTERHUB' AND "openVPNServiceId" IS NULL)
);