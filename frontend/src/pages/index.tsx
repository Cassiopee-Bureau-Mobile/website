import { NextPage } from 'next';

import Base from '@/layouts/base';

import { queryKeys } from '@/utils/constants';
import { fetchSideMenu } from '@/utils/fetchClient';
import { QueryClient, dehydrate } from '@tanstack/react-query';

const Home: NextPage = (props) => {
    return (
        <Base
            title='Home'
            description='This is the home page'>
            <main className='flex flex-col items-center justify-center py-2'>
                <div className='container mx-auto py-8'>
                    <h1 className='text-2xl font-bold mb-4'>Cassiopee - Bureau mobile sécurisé pour chercheurs</h1>
                    <p className='mb-4'>🔬 Projet de recherche pour la collaboration et la mobilité des chercheurs à distance</p>

                    <h2 className='text-xl font-bold mb-4'>Descriptif du site :</h2>
                    <p className='mb-4'>
                        Ce site est un outil de gestion des différents services du projet Cassiopee. Il permet de gérer les utilisateurs, les accès aux services et les différents composants du projet. Vous pourrez ainsi administer le serveur OpenVPN et le
                        serveur JupyterHub qui permettent aux chercheurs de travailler à distance de manière sécurisée.
                    </p>
                    <p className='mb-4'>
                        Ce site à été créé avec la technologie <code className='font-bold'>NextJS</code> et utilise des composants <code className='font-bold'>React</code> pour l&apos;interface utilisateur. De plus il utilise la librairie{' '}
                        <code className='font-bold'>TailwindCSS</code> pour le design et la mise en page. Enfin, il utilise la librairie <code className='font-bold'>React Query</code> pour la gestion des données et des requêtes vers l&apos;API.
                        <code className='font-bold'> Ansible</code> est utilisé pour la gestion des serveurs et des services.
                    </p>

                    <h2 className='text-xl font-bold mb-4'>Objectifs du projet :</h2>
                    <ul className='list-disc list-inside mb-4'>
                        <li>👨‍🔬 Étude de l&apos;état de l&apos;art des mécanismes de synchronisation d&apos;un ordinateur (rsync, git, cloud, etc.)</li>
                        <li>🔒 Conception d&apos;un bureau mobile sécurisé (synchronisation, applicatif, sécurité)</li>
                        <li>🧪 Tests et intégration (tests unitaires, tests d&apos;intégration)</li>
                        <li>🔧 Développement d&apos;un sous-ensemble de composants (navigation Web, VPN, persistance des données, etc.)</li>
                        <li>📖 Étude de cas : OS virtualisé en mémoire avec accès sécurisé à des applications dans un Cloud</li>
                    </ul>

                    <h2 className='text-xl font-bold mb-4'>Description du projet :</h2>
                    <p className='mb-4'>
                        Dans ce projet multidisciplinaire, l&apos;objectif est de rassembler, optimiser et développer un ensemble d&apos;outils qui permettront aux chercheurs concernés de travailler à distance de manière sécurisée. Cela prend en compte
                        plusieurs aspects du travail de chercheur comme la conception de documents collaboratifs, l&apos;exécution de code à distance et le besoin de mobilité. Toutes ces applications devront respecter un certain standard de sécurité pour
                        garantir la non-violation du travail de ces chercheurs.
                    </p>

                    <h2 className='text-xl font-bold mb-4'>Membres du projet :</h2>
                    <ul className='list-disc list-inside mb-4'>
                        <li>👨‍🔬 Guillemet Samuel (TSP)</li>
                        <li>👨‍🔬 Clément Safon (TSP)</li>
                    </ul>
                </div>
            </main>
        </Base>
    );
};

export async function getStaticProps() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: [queryKeys.sideMenu],
        queryFn: () => fetchSideMenu()
    });

    return {
        props: {
            dehydratedState: dehydrate(queryClient)
        }
    };
}

export default Home;
