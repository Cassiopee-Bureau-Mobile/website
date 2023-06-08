import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

import Base from '@/layouts/base';
import Grid from '@/components/Grid';

import UsersTabCard from '@/components/Cards/User/UsersTabCard';

import { getServerSession } from 'next-auth';
import { options } from '@/pages/api/auth/[...nextauth]';
import { pages } from '@/utils/constants';

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
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

    return { props: {} };
};

const Home = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    return (
        <Base
            title='Users management'
            description='This is the page for users management'>
            <Grid>
                <UsersTabCard />
            </Grid>
        </Base>
    );
};

export default Home;
