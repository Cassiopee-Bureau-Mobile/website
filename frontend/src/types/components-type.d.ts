type icon = 'dashboard' | 'performance' | 'note' | 'roundArrow' | 'clipboard' | 'settings' | 'account';

interface Page {
    name: string;
    href: string;
    icon: icon;
}

type UserData = {
    firstName: string;
    lastName: string;
};

type SideMenu = {
    label: string;
    pages: Page[];
    role?: 'ADMIN' | 'USER';
}[];

type ApiError = {
    error: string;
};

interface State {
    pid: number;
    [key: string]: any;
}

interface UserOptions {
    [key: string]: any;
}

interface AuthState {
    [key: string]: any;
}

interface Server {
    name: string;
    last_activity: Date;
    started: Date;
    pending: 'spawn' | 'stop';
    ready: boolean;
    stopped: boolean;
    url: string;
    user_options: UserOptions;
    progress_url: string;
    state: State;
}

interface Servers {
    [key: string]: Server;
}

interface JupyterUser {
    admin: boolean;
    roles: string[];
    auth_state: AuthState;
    name: string;
    groups: string[];
    created: Date;
    kind: string;
    server: string | null;
    last_activity: Date;
    pending: 'spawn' | 'stop';
    servers: Servers;
}

interface ServiceStatus {
    message: 'up' | 'down';
}

interface ClientIp {
    ip: string;
}

interface HostVars {
    ansible_host: string;
    ansible_user: string;
    ansible_sudo_pass: string;
}

interface SSHKey {
    ssh_key: string;
}

type Type = 'OpenVPN' | 'JupyterHub';

interface String {
    toLowerCase(this: Type): 'openvpn' | 'jupyterhub';
}

interface ApiMessage {
    message: string;
}

type JupyterUserCard =
    | {
          status: 'host-down' | 'unregistred';
          data: null;
      }
    | {
          status: 'registred';
          data: JupyterUser;
      };

type onStdout = (data: string) => void;

interface ApiRoutes {
    profile: {
        ip: string;
    };
    services: {
        ipStatus: string;
        jupyterhub: {
            hosts: string;
            index: string;
            install: string;
            sshKey: string;
            url: string;
            users: {
                user: (user: string) => string;
                index: string;
            };
        };
        openvpn: {
            hosts: string;
            index: string;
            install: string;
            sshKey: string;
            users: {
                user: (user: string) => string;
                index: string;
            };
        };
    };
    sidemenu: string;
    users: {
        user: (user: string) => string;
        index: string;
        me: string;
        resetPassword: string;
        verifyEmail: string;
    };
}
