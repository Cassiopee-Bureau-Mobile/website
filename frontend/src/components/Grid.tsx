export default function Grid({ children }: { children: React.ReactNode }): JSX.Element {
    return <div className='md:grid flex flex-col gap-10 md:grid-cols-3 lg:grid-cols-4 p-4'>{children}</div>;
}
