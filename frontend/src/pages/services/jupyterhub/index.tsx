import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';

import Base from '@/layouts/base';

import JupyterCard from '@/components/Cards/JupyterHub/JupyterHubServerCard';
import HostCard from '@/components/Cards/HostCard';
import SSHKeyCard from '@/components/Cards/SSHKeyCard';
import InstallCard from '@/components/Cards/InstallCard';

import { getJupyterHubIP, getJupyterHubUrl, getServiceInstallationStatus } from '@/utils/queries';
import { getServerSession } from 'next-auth';
import { options } from '@/pages/api/auth/[...nextauth]';
import { pages } from '@/utils/constants';
import Grid from '@/components/Grid';

export const getServerSideProps: GetServerSideProps<{
    jupyterHubUrl: string;
    jupyterHubIp: string;
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

    const jupyterHubUrl = await getJupyterHubUrl();
    const jupyterHubIp = await getJupyterHubIP();

    const installed = await getServiceInstallationStatus('JUPYTERHUB');

    return { props: { jupyterHubUrl, jupyterHubIp, installed } };
};

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (props) => {
    return (
        <Base
            title='JupyterHub Service Overview'
            description='This is the service page for JupyterHub'>
            <Grid>
                <JupyterCard
                    jupyterHubUrl={props.jupyterHubUrl}
                    jupyterHubIp={props.jupyterHubIp}
                    installed={props.installed}
                />
                <InstallCard
                    type='JupyterHub'
                    installed={props.installed}
                    ip={props.jupyterHubIp}
                />
                <HostCard type='JupyterHub' />
                <SSHKeyCard type='JupyterHub' />
            </Grid>
        </Base>
    );
};

export default Home;
