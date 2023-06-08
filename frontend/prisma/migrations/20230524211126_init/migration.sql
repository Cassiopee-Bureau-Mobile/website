-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "jupyterHubServiceId" TEXT,
ADD COLUMN     "openVPNServiceId" TEXT;

-- CreateTable
CREATE TABLE "JupyterHubService" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "installed" BOOLEAN NOT NULL DEFAULT false,
    "token" TEXT,
    "url" TEXT,
    "ip" TEXT,

    CONSTRAINT "JupyterHubService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpenVPNService" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "installed" BOOLEAN NOT NULL DEFAULT false,
    "ip" TEXT,

    CONSTRAINT "OpenVPNService_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JupyterHubService_name_key" ON "JupyterHubService"("name");

-- CreateIndex
CREATE UNIQUE INDEX "JupyterHubService_token_key" ON "JupyterHubService"("token");

-- CreateIndex
CREATE UNIQUE INDEX "JupyterHubService_url_key" ON "JupyterHubService"("url");

-- CreateIndex
CREATE UNIQUE INDEX "JupyterHubService_ip_key" ON "JupyterHubService"("ip");

-- CreateIndex
CREATE UNIQUE INDEX "OpenVPNService_name_key" ON "OpenVPNService"("name");

-- CreateIndex
CREATE UNIQUE INDEX "OpenVPNService_ip_key" ON "OpenVPNService"("ip");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_jupyterHubServiceId_fkey" FOREIGN KEY ("jupyterHubServiceId") REFERENCES "JupyterHubService"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_openVPNServiceId_fkey" FOREIGN KEY ("openVPNServiceId") REFERENCES "OpenVPNService"("id") ON DELETE SET NULL ON UPDATE CASCADE;
