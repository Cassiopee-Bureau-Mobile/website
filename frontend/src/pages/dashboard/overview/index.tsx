import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';

import Base from '@/layouts/base';

import JupyterCard from '@/components/Cards/JupyterHub/JupyterHubUserCard';
import OpenVPNCard from '@/components/Cards/OpenVPN/OpenVPNUserCard';

import OpenVPNAddUserCard from '@/components/Cards/OpenVPN/OpenVPNAddUserCard';
import OpenVPNGetCertCard from '@/components/Cards/OpenVPN/OpenVPNGetCertCard';

import JupyterHubAddUserCard from '@/components/Cards/JupyterHub/JupyterHubAddUserCard';
import JupyterHubModifyUserCard from '@/components/Cards/JupyterHub/JupyterHubModifyUserCard';

import UserModifyProfileCard from '@/components/Cards/User/UserModifyProfileCard';

import { getJupyterHubUrl, getOpenVPNIp, getServiceRegistrationList } from '@/utils/queries';
import { getServerSession } from 'next-auth';
import { ServiceType } from '@prisma/client';
import { options } from '@/pages/api/auth/[...nextauth]';
import { pages } from '@/utils/constants';
import Grid from '@/components/Grid';

export const getServerSideProps: GetServerSideProps<{
    jupyterHubUrl: string;
    openVpnIp: string;
    serviceRegistrationList: string[];
}> = async (context) => {
    const session = await getServerSession(context.req, context.res, options);

    if (!session)
        return {
            redirect: {
                destination: pages.signin,
                permanent: false
            }
        };

    const jupyterHubUrl = await getJupyterHubUrl();
    const openVpnIp = await getOpenVPNIp();
    const serviceRegistrationList = await getServiceRegistrationList(session.user.username);

    return { props: { jupyterHubUrl, openVpnIp, serviceRegistrationList } };
};

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (props) => {
    return (
        <Base
            title='Dashboard Overview'
            description='This is the dashboard overview page'>
            <Grid>
                <JupyterCard jupyterHubUrl={props.jupyterHubUrl} />
                <OpenVPNCard openVpnIp={props.openVpnIp} />
                {props.serviceRegistrationList.includes(ServiceType.JUPYTERHUB) ? <JupyterHubModifyUserCard /> : <JupyterHubAddUserCard />}
                {props.serviceRegistrationList.includes(ServiceType.OPENVPN) ? <OpenVPNGetCertCard /> : <OpenVPNAddUserCard />}
                <UserModifyProfileCard />
            </Grid>
        </Base>
    );
};

export default Home;
