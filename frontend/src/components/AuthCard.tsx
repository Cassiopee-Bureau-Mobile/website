interface AuthCardProps {
    children: React.ReactNode;
}

export default function AuthCard({ children }: AuthCardProps) {
    return <div className='border p-4 bg-gray-50 rounded-lg shadow-md dark:bg-gray-800 flex flex-col dark:border-gray-500 space-y-3 place-self-center min-[450px]:w-[400px] min-[450px]:aspect-square my-auto'>{children}</div>;
}
