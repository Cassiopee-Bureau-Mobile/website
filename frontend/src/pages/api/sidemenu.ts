import type { NextApiRequest, NextApiResponse } from 'next';

export const sideMenu: SideMenu = [
    {
        label: 'Accueil',
        pages: [
            {
                name: 'Accueil',
                href: '/',
                icon: 'dashboard'
            }
        ]
    },
    {
        label: 'Dashboard',
        pages: [
            {
                name: 'Overview',
                href: '/dashboard/overview',
                icon: 'performance'
            }
        ]
    },
    {
        label: 'Services',
        role: 'ADMIN',
        pages: [
            {
                name: 'VPN',
                href: '/services/openvpn',
                icon: 'roundArrow'
            },
            {
                name: 'JupyterHub',
                href: '/services/jupyterhub',
                icon: 'clipboard'
            },
            {
                name: 'Utilisateurs',
                href: '/services/users',
                icon: 'account'
            }
        ]
    }
];

export default function handler(req: NextApiRequest, res: NextApiResponse<SideMenu>) {
    res.status(200).json(sideMenu);
}
