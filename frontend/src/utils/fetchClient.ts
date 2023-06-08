import ky, { Options } from 'ky';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRoutes, apiUrl, queryKeys } from './constants';
import { sideMenu } from '@/data/sidemenu';
import { ServiceType, User } from '@prisma/client';
import { HttpMethod } from 'ky/distribution/types/options';
import { LiteralUnion, useSession } from 'next-auth/react';

export async function fetchData<T>(url: string, options: Options = {}, baseUrl: string = apiUrl) {
    const newUrl = new URL(url, baseUrl);
    const baseOptions: Options = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    options = { ...baseOptions, ...options };
    try {
        return await ky(newUrl, options).json<T>();
    } catch (error) {
        throw error;
    }
}

export const fetchUserData = () => fetchData<UserData>(apiRoutes.users.me);
export const useUserData = () => {
    const session = useSession();

    return useQuery({
        queryKey: [queryKeys.me],
        queryFn: () => fetchUserData(),
        enabled: !!session.data?.user
    });
};

export const postUserData = (data: Partial<UserData>) => fetchData<UserData>(apiRoutes.users.me, { method: 'PATCH', json: data });
export const usePostUserData = () => {
    return useMutation({
        mutationKey: [queryKeys.me],
        mutationFn: (data: Partial<UserData>) => postUserData(data)
    });
};

export const fetchSideMenu = () => fetchData<SideMenu>(apiRoutes.sidemenu);
export const useSideMenu = () => {
    return useQuery({
        queryKey: [queryKeys.sideMenu],
        queryFn: () => fetchSideMenu(),
        initialData: sideMenu
    });
};

export const fetchJupyterUser = (user: string) => fetchData<JupyterUserCard>(apiRoutes.services.jupyterhub.users.user(user));
export const useJupyterUser = (user: string) => {
    return useQuery({
        queryKey: [queryKeys.jupyterUser, user],
        queryFn: () => fetchJupyterUser(user),
        enabled: user !== ''
    });
};

export const fetchOpenVPNStatus = () => fetchData<ServiceStatus>(apiRoutes.services.openvpn.index);
export const useOpenVPNStatus = () => {
    return useQuery({
        queryKey: [queryKeys.openVPN],
        queryFn: () => fetchOpenVPNStatus()
    });
};

export const fetchJupyterHubStatus = () => fetchData<ServiceStatus>(apiRoutes.services.jupyterhub.index);
export const useJupyterHubStatus = () => {
    return useQuery({
        queryKey: [queryKeys.jupyterHub],
        queryFn: () => fetchJupyterHubStatus()
    });
};

export const postIpStatus = (ip: string) =>
    fetchData<ServiceStatus>(apiRoutes.services.ipStatus, {
        method: 'POST',
        json: { ip }
    });
export const useFetchIpStatus = (ip: string) => {
    return useQuery({
        queryKey: [queryKeys.ipStatus, ip],
        queryFn: () => postIpStatus(ip)
    });
};

export const fetchClientIp = () => fetchData<ClientIp>(apiRoutes.profile.ip);
export const useClientIp = () => {
    return useQuery({
        queryKey: [queryKeys.ip],
        queryFn: () => fetchClientIp()
    });
};

export const fetchHost = (type: Type) => fetchData<HostVars>(apiRoutes.services[type.toLowerCase()].hosts);
export const useHost = (type: Type) => {
    return useQuery({
        queryKey: [queryKeys.host, type],
        queryFn: () => fetchHost(type)
    });
};

export const postHost = (type: Type, host: HostVars) =>
    fetchData<HostVars>(apiRoutes.services[type.toLowerCase()].hosts, {
        method: 'POST',
        json: host
    });
export const usePostHost = (type: Type) => {
    return useMutation({
        mutationKey: [queryKeys.host, type],
        mutationFn: (host: HostVars) => postHost(type, host)
    });
};

export const fetchSSHKey = (type: Type) => fetchData<SSHKey>(apiRoutes.services[type.toLowerCase()].sshKey);
export const useSSHKey = (type: Type) => {
    return useQuery({
        queryKey: [queryKeys.sshKey, type],
        queryFn: () => fetchSSHKey(type)
    });
};

export const postSSHKey = (type: Type, sshKey: SSHKey) =>
    fetchData<SSHKey>(apiRoutes.services[type.toLowerCase()].sshKey, {
        method: 'POST',
        json: sshKey
    });
export const usePostSSHKey = (type: Type) => {
    return useMutation({
        mutationKey: [queryKeys.sshKey, type],
        mutationFn: (sshKey: SSHKey) => postSSHKey(type, sshKey)
    });
};

export const postJupyterHubUrl = (url: string) =>
    fetchData<{ url: string }>(apiRoutes.services.jupyterhub.url, {
        method: 'POST',
        json: { url }
    });

export const usePostJupyterHubUrl = () => {
    return useMutation({
        mutationKey: [queryKeys.jupyterHub, queryKeys.url],
        mutationFn: (url: string) => postJupyterHubUrl(url)
    });
};

type TabUser = User & {
    profile: {
        firstName: string;
        lastName: string;
        serviceRegistration: {
            name: ServiceType;
        }[];
    } | null;
};

const fetchUser = (user: string, method: LiteralUnion<HttpMethod> = 'get', data?: Partial<TabUser>) =>
    fetchData<TabUser>(apiRoutes.users.user(user), {
        method: method,
        json: data,
        timeout: false
    });
export const useUser = (user: string) => {
    return useQuery({
        queryKey: [queryKeys.user, user],
        queryFn: () => fetchUser(user)
    });
};

export const useDeleteUser = (user: string) => {
    return useMutation({
        mutationKey: [queryKeys.user],
        mutationFn: () => fetchUser(user, 'delete')
    });
};

export const useMutateUser = (user: string) => {
    return useMutation({
        mutationKey: [queryKeys.user],
        mutationFn: (data: Partial<User>) => fetchUser(user, 'put', data)
    });
};

export const fetchUsers = () => fetchData<User[]>(apiRoutes.users.index);
export const useUsers = () => {
    return useQuery({
        queryKey: [queryKeys.users],
        queryFn: () => fetchUsers()
    });
};
