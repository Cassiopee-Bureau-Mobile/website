export const queryKeys = {
    me: 'me',
    sideMenu: 'sideMenu',
    jupyterUser: 'jupyterUser',
    openVPN: 'openVPN',
    jupyterHub: 'jupyterHub',
    ip: 'ip',
    host: 'host',
    sshKey: 'sshKey',
    ipStatus: 'ipStatus',
    url: 'url',
    user: 'user',
    users: 'users'
};

export const pages = {
    home: '/',
    signin: '/auth/signin',
    signup: '/auth/signup',
    signout: '/auth/signout',
    verifyEmail: '/auth/verify-email',
    forgotPassword: '/auth/forgot-password',
    changePassword: '/auth/change-password',
    dashboard: '/dashboard/overview',
    jupyterhub: '/services/jupyterhub',
    openvpn: '/services/openvpn'
};

export const apiRoutes: ApiRoutes = {
    profile: {
        ip: '/api/profile/ip'
    },
    services: {
        ipStatus: '/api/services/ip-status',
        jupyterhub: {
            hosts: '/api/services/jupyterhub/hosts',
            index: '/api/services/jupyterhub/',
            install: '/api/services/jupyterhub/install',
            sshKey: '/api/services/jupyterhub/ssh-key',
            url: '/api/services/jupyterhub/url',
            users: {
                user: (user: string) => `/api/services/jupyterhub/users/${user}`,
                index: '/api/services/jupyterhub/users'
            }
        },
        openvpn: {
            hosts: '/api/services/openvpn/hosts',
            index: '/api/services/openvpn/',
            install: '/api/services/openvpn/install',
            sshKey: '/api/services/openvpn/ssh-key',
            users: {
                user: (user: string) => `/api/services/openvpn/users/${user}`,
                index: '/api/services/openvpn/users'
            }
        }
    },
    sidemenu: '/api/sidemenu',
    users: {
        user: (user: string) => `/api/users/${user}`,
        index: '/api/users',
        me: '/api/users/me',
        resetPassword: '/api/users/reset-password',
        verifyEmail: '/api/users/verify-email'
    }
} as const;

export const apiUrl = process.env.NEXT_PUBLIC_BASE_URL as string;
export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;

let ansiblePath: {
    openvpn: {
        base: string;
        playbooks: string;
        hosts: string;
        sshKey: string;
    };
    jupyterhub: {
        base: string;
        playbooks: string;
        hosts: string;
        sshKey: string;
        host_vars: string;
    };
};

if (process.env.NODE_ENV === 'development') {
    ansiblePath = {
        openvpn: {
            base: '../ansible/ansible-openvpn/',
            playbooks: '../ansible/ansible-openvpn/playbooks/',
            hosts: '../ansible/ansible-openvpn/inventories/cassiopee/hosts.ini',
            sshKey: '../ansible/keys/openvpn_key'
        },
        jupyterhub: {
            base: '../ansible/ansible-jupyterhub/',
            playbooks: '../ansible/ansible-jupyterhub/playbooks/',
            hosts: '../ansible/ansible-jupyterhub/inventories/cassiopee/hosts.ini',
            sshKey: '../ansible/keys/jupyterhub_key',
            host_vars: '../ansible/ansible-jupyterhub/inventories/cassiopee/host_vars/'
        }
    };
} else {
    ansiblePath = {
        openvpn: {
            base: '/etc/ansible/ansible-openvpn/',
            playbooks: '/etc/ansible/ansible-openvpn/playbooks/',
            hosts: '/etc/ansible/ansible-openvpn/inventories/cassiopee/hosts.ini',
            sshKey: '/etc/ansible/keys/openvpn_key'
        },
        jupyterhub: {
            base: '/etc/ansible/ansible-jupyterhub/',
            playbooks: '/etc/ansible/ansible-jupyterhub/playbooks/',
            hosts: '/etc/ansible/ansible-jupyterhub/inventories/cassiopee/hosts.ini',
            sshKey: '/etc/ansible/keys/jupyterhub_key',
            host_vars: '/etc/ansible/ansible-jupyterhub/inventories/cassiopee/host_vars/'
        }
    };
}

export { ansiblePath };
