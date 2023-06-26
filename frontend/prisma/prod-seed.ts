import { PrismaClient, Prisma } from '@prisma/client';
import { SHA256 } from 'crypto-js';

const password = process.argv[2];
if (!password) {
    console.error('No password provided');
    process.exit(1);
}

if (password === 'ADMIN-PASSWORD-TO-CHANGE') {
    console.error('Please change the default password');
    process.exit(1);
}

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
    {
        username: 'admin',
        password: SHA256(password).toString(),
        email: 'admin@localhost',
        emailVerified: new Date(),
        role: 'ADMIN',
        profile: {
            create: {
                firstName: 'Admin',
                lastName: 'Admin'
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

async function main() {
    console.log(`Start seeding ...`);
    for (const u of userData) {
        const user = await prisma.user.create({
            data: u,
        });
        console.log(`Created user with id: ${user.id}`);
    }
    const jupyterHub = await prisma.jupyterHubService.create({
        data: jupyterHubData,
    });
    console.log(`Created jupyterHub with id: ${jupyterHub.id}`);
    const openVpn = await prisma.openVPNService.create({
        data: openVpnData,
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
