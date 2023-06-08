interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export const Card = ({ children, className }: CardProps) => {
    return <div className={`${className} bg-white relative container flex-grow flex flex-col rounded-lg shadow-md md:px-6 py-4 px-4 border border-slate-300 border-opacity-30 mx-auto`}>{children}</div>;
};
