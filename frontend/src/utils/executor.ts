// The goal of this file is to provide a interface to execute the ansible playbooks.
// The ansible playbooks are located in /etc/ansible/*

import { NotFoundError, extractHostLine } from '@/utils/utils';
import { exec } from '@/lib/exec';
import { chmod, chmodSync, copyFile, copyFileSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { ansiblePath } from '@/utils/constants';
import { getJupyterHubIP, getOpenVPNIp } from './queries';
import prisma from '@/lib/prisma';

function sanitazeUsername(username: string): string {
    return username.replace(/[^a-zA-Z0-9]/g, '');
}

function generateSeed() {
    return Math.floor(Math.random() * 1000000);
}

const checkMode = process.env.APP_ENV === 'test' ? '-e cmd_hosts=localhost -e cmd_become=false -e cmd_ignore_errors=true --check' : '';

//#region OpenVPN

/**
 * Install OpenVPN
 * @param onStdout Callback to get the stdout
 */
export async function installOpenVPN(onStdout: onStdout): Promise<void> {
    const cmd = `cd ${ansiblePath.openvpn.base} && ansible-playbook ${checkMode} playbooks/install.yml -i inventories/cassiopee/hosts.ini`;
    await exec(cmd, onStdout, 'install-openvpn');
}

// Restart OpenVPN service
export async function restartOpenVPN(): Promise<void> {
    const cmd = `cd ${ansiblePath.openvpn.base} && ansible-playbook ${checkMode} playbooks/restart.yml -i inventories/cassiopee/hosts.ini`;
    await exec(cmd, undefined, 'restart-openvpn');
}

// Add client to OpenVPN
export async function addOpenVPNClient(username: string, onStdout: onStdout): Promise<void> {
    const seed = generateSeed();
    try {
        //Create file with username
        await exec(`echo "clients_to_add: ["${username}"]" > /tmp/${seed}.yml`);
        const cmd = `cd ${ansiblePath.openvpn.base} && ansible-playbook ${checkMode} playbooks/add_clients.yml -i inventories/cassiopee/hosts.ini -e @/tmp/${seed}.yml`;
        await exec(cmd, onStdout, 'add-openvpn-client');
    } finally {
        await exec(`rm -f /tmp/${seed}.yml`);
    }
}

// Revoke client from OpenVPN
export async function revokeOpenVPNClient(username: string): Promise<void> {
    const seed = generateSeed();
    try {
        //Create file with username
        await exec(`echo "clients_to_revoke: ["${username}"]" > /tmp/${seed}.yml`);
        const cmd = `cd ${ansiblePath.openvpn.base} && ansible-playbook ${checkMode} playbooks/revoke_clients.yml -i inventories/cassiopee/hosts.ini -e @/tmp/${seed}.yml`;
        await exec(cmd, undefined, 'revoke-openvpn-client');
    } finally {
        await exec(`rm -f /tmp/${seed}.yml`);
    }
}

// Get OpenVPN client config file
export async function getOpenVPNClientConfig(_username: string): Promise<string> {
    const username = sanitazeUsername(_username);

    const openVPNIp = await getOpenVPNIp();
    const exists = (await exec(`test -d ${ansiblePath.openvpn.base}fetched_creds/${openVPNIp}/${username} && echo "true" || echo "false"`)).trim();
    if (exists !== 'true') {
        throw new NotFoundError(`User ${username} does not exist`);
    }

    const path = `${ansiblePath.openvpn.base}fetched_creds/${openVPNIp}/${username}/${username}.ovpn`;
    return readFileSync(path, 'utf8');
}

// Get OpenVPN status
export async function getOpenVPNStatus(): Promise<'up' | 'down'> {
    const ip = await getOpenVPNIp();
    if ((await getIpStatus(ip)) === 'down') {
        return 'down';
    }
    const cmd = `nmap -p 443 --open -n -oG - ${ip} | grep -q "443/open" && echo "up" || echo "down"`;
    const stdout = await exec(cmd, undefined, 'get-openvpn-status');
    return stdout.trim() as 'up' | 'down';
}

//#endregion

//#region JupyterHub

// Install JupyterHub
export async function installJupyterHub(onStdout: (data: any) => void): Promise<string> {
    const cmd = `cd ${ansiblePath.jupyterhub.base} && ansible-playbook ${checkMode} playbooks/install.yml -i inventories/cassiopee/hosts.ini`;
    await exec(cmd, onStdout, 'install-jupyterhub');
    const ip = await getJupyterHubIP();
    const file = readFileSync(`${ansiblePath.jupyterhub.host_vars}/${ip}.yml`, 'utf8');
    return file.trim().split(' ')[1];
}

// Restart JupyterHub service
export async function restartJupyterHub(): Promise<void> {
    const cmd = `cd ${ansiblePath.jupyterhub.base} && ansible-playbook ${checkMode} playbooks/restart.yml -i inventories/cassiopee/hosts.ini`;
    await exec(cmd, undefined, 'restart-jupyterhub');
}

// Add user to JupyterHub
export async function addJupyterHubUser(username: string, password: string, onStdout: onStdout): Promise<void> {
    const seed = generateSeed();
    try {
        await exec(`echo "username: ${username}" > /tmp/${seed}.yml`);
        await exec(`echo "password: ${password}" >> /tmp/${seed}.yml`);
        const cmd = `cd ${ansiblePath.jupyterhub.base} && ansible-playbook ${checkMode} playbooks/add_user.yml -i inventories/cassiopee/hosts.ini -e @/tmp/${seed}.yml`;
        await exec(cmd, onStdout, 'add-jupyterhub-user');
    } finally {
        await exec(`rm /tmp/${seed}.yml`);
    }
}

// Delete user from JupyterHub
export async function deleteJupyterHubUser(username: string): Promise<void> {
    const seed = generateSeed();
    await exec(`echo "username: ${username}" > /tmp/${seed}.yml`);
    const cmd = `cd ${ansiblePath.jupyterhub.base} && ansible-playbook ${checkMode} playbooks/remove_user.yml -i inventories/cassiopee/hosts.ini -e @/tmp/${seed}.yml`;
    await exec(cmd, undefined, 'delete-jupyterhub-user');
    await exec(`rm /tmp/${seed}.yml`);
}

// Change user password on JupyterHub
export async function changeJupyterHubUserPassword(username: string, password: string, onStdout: onStdout): Promise<void> {
    const seed = generateSeed();
    await exec(`echo "username: ${username}" > /tmp/${seed}.yml`);
    await exec(`echo "password: ${password}" >> /tmp/${seed}.yml`);
    const cmd = `cd ${ansiblePath.jupyterhub.base} && ansible-playbook ${checkMode} playbooks/change_password_user.yml -i inventories/cassiopee/hosts.ini -e @/tmp/${seed}.yml`;
    await exec(cmd, onStdout, 'change-jupyterhub-user-password');
    await exec(`rm /tmp/${seed}.yml`);
}

//#endregion

//#region Hosts
export async function getOpenVPNHosts(): Promise<HostVars> {
    const file = readFileSync(ansiblePath.openvpn.hosts, 'utf8').split('\n');
    let lineToModify = extractHostLine(file, 'OpenVPN');

    const args = file[lineToModify].split(' ');
    const hostVars: HostVars = {
        ansible_host: '',
        ansible_user: '',
        ansible_sudo_pass: ''
    };
    for (const arg of args) {
        if (arg.includes('=')) {
            const [key, value] = arg.split('=');
            if (key && value && key in hostVars) {
                hostVars[key as keyof HostVars] = value;
            }
        }
    }
    const res = await prisma.openVPNService.findFirstOrThrow();
    hostVars.ansible_host = res.ip || '';
    return hostVars;
}

export async function setOpenVPNHosts(hosts: HostVars): Promise<void> {
    const file = readFileSync(ansiblePath.openvpn.hosts, 'utf8').split('\n');
    let lineToModify = extractHostLine(file, 'OpenVPN');
    file[lineToModify] = hosts ? `${hosts.ansible_host} ansible_user=${hosts.ansible_user} ansible_sudo_pass=${hosts.ansible_sudo_pass}` : '';
    writeFileSync(ansiblePath.openvpn.hosts, file.join('\n'));
    await prisma.openVPNService.findFirstOrThrow().then((res) => {
        prisma.openVPNService.update({
            where: { id: res.id },
            data: { ip: hosts.ansible_host }
        });
    });
}

export async function getJupyterHubHosts(): Promise<HostVars> {
    const file = readFileSync(ansiblePath.jupyterhub.hosts, 'utf8').split('\n');
    let lineToModify = extractHostLine(file, 'JupyterHub');

    const args = file[lineToModify].split(' ');
    const hostVars: HostVars = {
        ansible_host: '',
        ansible_user: '',
        ansible_sudo_pass: ''
    };
    for (const arg of args) {
        if (arg.includes('=')) {
            const [key, value] = arg.split('=');
            if (key && value && key in hostVars) {
                hostVars[key as keyof HostVars] = value;
            }
        }
    }
    const res = await prisma.jupyterHubService.findFirstOrThrow();
    hostVars.ansible_host = res.ip ?? '';
    return hostVars;
}

export async function setJupyterHubHosts(hosts: HostVars): Promise<void> {
    const file = readFileSync(ansiblePath.jupyterhub.hosts, 'utf8').split('\n');
    let lineToModify = extractHostLine(file, 'JupyterHub');
    file[lineToModify] = hosts ? `${hosts.ansible_host} ansible_user=${hosts.ansible_user} ansible_sudo_pass=${hosts.ansible_sudo_pass}` : '';
    writeFileSync(ansiblePath.jupyterhub.hosts, file.join('\n'));
    await prisma.jupyterHubService.findFirstOrThrow().then((res) => {
        prisma.jupyterHubService.update({
            where: { id: res.id },
            data: { ip: hosts.ansible_host }
        });
    });
}

//#endregion

//#region SSH Keys

export async function getOpenVPNSSHKey(): Promise<SSHKey> {
    if (!existsSync(ansiblePath.openvpn.sshKey)) {
        return { ssh_key: '' };
    }
    const file = readFileSync(ansiblePath.openvpn.sshKey, 'utf8');

    return { ssh_key: file };
}

export async function setOpenVPNSSHKey(key: SSHKey): Promise<void> {
    if (!key.ssh_key.endsWith('\n')) {
        key.ssh_key += '\n';
    }
    writeFileSync(ansiblePath.openvpn.sshKey, key.ssh_key);

    // Update SSH key without the unsecure
    copyFileSync(ansiblePath.openvpn.sshKey, ansiblePath.openvpn.sshKey.replace('_unsecure', ''));
    chmodSync(ansiblePath.openvpn.sshKey.replace('_unsecure', ''), '600');
}

export async function getJupyterHubSSHKey(): Promise<SSHKey> {
    if (!existsSync(ansiblePath.jupyterhub.sshKey)) {
        return { ssh_key: '' };
    }
    const file = readFileSync(ansiblePath.jupyterhub.sshKey, 'utf8');

    return { ssh_key: file };
}

export async function setJupyterHubSSHKey(key: SSHKey): Promise<void> {
    // Check if the content as an ending line break
    if (!key.ssh_key.endsWith('\n')) {
        key.ssh_key += '\n';
    }
    writeFileSync(ansiblePath.jupyterhub.sshKey, key.ssh_key);

    // Update SSH key without the unsecure
    copyFileSync(ansiblePath.jupyterhub.sshKey, ansiblePath.jupyterhub.sshKey.replace('_unsecure', ''));
    chmodSync(ansiblePath.jupyterhub.sshKey.replace('_unsecure', ''), '600');
}

//#endregion

export async function getIpStatus(ip: string): Promise<'up' | 'down'> {
    const cmd = `ping -c 1 -W 1 ${ip}`;
    try {
        await exec(cmd);
        return 'up';
    } catch (error) {
        return 'down';
    }
}

async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
