import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

import Base from '@/layouts/base';

import OpenVPNCard from '@/components/Cards/OpenVPN/OpenVPNServerCard';
import HostCard from '@/components/Cards/HostCard';
import SSHKeyCard from '@/components/Cards/SSHKeyCard';
import InstallCard from '@/components/Cards/InstallCard';

import { getOpenVPNIp, getServiceInstallationStatus } from '@/utils/queries';
import { getServerSession } from 'next-auth';
import { options } from '@/pages/api/auth/[...nextauth]';
import { pages } from '@/utils/constants';
import Grid from '@/components/Grid';

export const getServerSideProps: GetServerSideProps<{
    openVpnIp: string;
    installed: boolean;
}> = async (context) => {
    const session = await getServerSession(context.req, context.res, options);

    if (!session)
        return {
            redirect: {
                destination: pages.signin,
                permanent: false
            }
        };
    if (session.user.role !== 'ADMIN')
        return {
            redirect: {
                destination: pages.dashboard,
                permanent: false
            }
        };

    const openVpnIp = await getOpenVPNIp();

    const installed = await getServiceInstallationStatus('OPENVPN');

    return { props: { openVpnIp, installed } };
};

const Home = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    return (
        <Base
            title='OpenVPN Service Overview'
            description='This is the service page for OpenVPN'>
            <Grid>
                <OpenVPNCard
                    installed={props.installed}
                    openVpnIp={props.openVpnIp}
                />
                <InstallCard
                    installed={props.installed}
                    ip={props.openVpnIp}
                    type='OpenVPN'
                />
                <HostCard type='OpenVPN' />
                <SSHKeyCard type='OpenVPN' />
            </Grid>
        </Base>
    );
};

export default Home;
