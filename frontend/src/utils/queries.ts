import prisma from '@/lib/prisma';
import { NotFoundError } from './utils';
import { ServiceType } from '@prisma/client';

/**
 * Get JupyterHub url
 * @returns JupyterHub url
 * @throws {NotFoundError} JupyterHub url not found
 */
export async function getJupyterHubUrl(): Promise<string> {
    const res = await prisma.jupyterHubService.findFirst({
        select: { url: true }
    });
    if (!res || !res.url) {
        const ip = await getJupyterHubIP();
        return `http://${ip}`;
    }
    return res.url;
}

/**
 * Get JupyterHub IP
 * @returns JupyterHub IP
 * @throws {NotFoundError} JupyterHub IP not found
 */
export async function getJupyterHubIP(): Promise<string> {
    const ip = await prisma.jupyterHubService.findFirst({
        select: { ip: true }
    });
    if (!ip || !ip.ip) {
        throw new NotFoundError('JupyterHub IP not found');
    }
    return ip.ip;
}

/**
 * Get JupyterHub token
 * @returns JupyterHub token
 * @throws {NotFoundError} JupyterHub token not found
 */
export async function getJupyterHubToken(): Promise<string> {
    const res = await prisma.jupyterHubService.findFirst({
        select: { token: true }
    });
    if (!res || !res.token) {
        throw new NotFoundError('JupyterHub token not found');
    }
    return res.token;
}

/**
 * Get OpenVPN IP
 * @returns OpenVPN IP
 * @throws {NotFoundError} OpenVPN IP not found
 */
export async function getOpenVPNIp(): Promise<string> {
    const ip = await prisma.openVPNService.findFirst({
        select: { ip: true }
    });
    if (!ip || !ip.ip) {
        throw new NotFoundError('OpenVPN IP not found');
    }
    return ip.ip;
}

/**
 * Get the list of services registered by a user
 * @param _user User to get the list of services from
 * @returns List of services registered by the user
 * @throws {NotFoundError} User not found
 */
export async function getServiceRegistrationList(_user: string): Promise<string[]> {
    const user = await prisma.user.findFirst({
        where: {
            username: _user
        },
        select: {
            profile: { select: { serviceRegistration: { select: { name: true } } } }
        }
    });
    if (!user) {
        throw new NotFoundError('User not found');
    }
    if (!user.profile?.serviceRegistration) {
        return [];
    }
    return user.profile.serviceRegistration.map((data) => data.name);
}

/**
 * Get the installation satatus of a service
 * @param service Service to get the installation status from
 * @returns Installation status of the service
 * @throws {NotFoundError} Service not found
 */
export async function getServiceInstallationStatus(service: ServiceType): Promise<boolean> {
    if (service === 'JUPYTERHUB') {
        const res = await prisma.jupyterHubService.findFirst({
            select: { installed: true }
        });
        if (!res) {
            throw new NotFoundError('Service not found');
        }
        return res.installed;
    } else if (service === 'OPENVPN') {
        const res = await prisma.openVPNService.findFirst({
            select: { installed: true }
        });
        if (!res) {
            throw new NotFoundError('Service not found');
        }
        return res.installed;
    } else {
        throw new NotFoundError('Service not found');
    }
}
