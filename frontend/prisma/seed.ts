import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
    {
        username: 'admin',
        password: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // admin
        email: 'admin@localhost',
        role: 'ADMIN',
        profile: {
            create: {
                firstName: 'Admin',
                lastName: 'Admin'
            },
        },
    },
    {
        username: 'user',
        password: '04f8996da763b7a969b1028ee3007569eaf3a635486ddab211d512c85b9df8fb', // user
        email: 'user@localhost',
        role: 'USER',
        profile: {
            create: {
                firstName: 'User',
                lastName: 'User'
            },
        },
    }
];

const jupyterHubData: Prisma.JupyterHubServiceCreateInput = {
    name: 'JupyterHub',
    ip: '192.168.0.126',
    installed: false,
    url: 'http://192.168.0.126'
};

const openVpnData: Prisma.OpenVPNServiceCreateInput = {
    name: 'OpenVPN',
    ip: '192.168.0.127',
    installed: false
};

const installedJupyterHubData: Prisma.JupyterHubServiceCreateInput = {
    name: 'JupyterHub',
    ip: '192.168.0.126',
    installed: true,
    token: '889ccd55dbf19db40d33741df271d67189c1750e3fee1935d221fd188fae8e31',
    url: 'http://192.168.0.126'
};

const installedOpenVpnData: Prisma.OpenVPNServiceCreateInput = {
    name: 'OpenVPN',
    ip: '192.168.0.127',
    installed: true
};

async function main() {

    console.log(`Start seeding ...`);
    for (const u of userData) {
        const user = await prisma.user.create({
            data: u,
        });
        console.log(`Created user with id: ${user.id}`);
    }
    const jupyterHub = await prisma.jupyterHubService.create({
        data: process.env.APP_ENV === 'test' ? jupyterHubData : installedJupyterHubData,
    });
    console.log(`Created jupyterHub with id: ${jupyterHub.id}`);
    const openVpn = await prisma.openVPNService.create({
        data: process.env.APP_ENV === 'test' ? openVpnData : installedOpenVpnData,
    });
    console.log(`Created openVpn with id: ${openVpn.id}`);
    console.log(`Seeding finished.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
