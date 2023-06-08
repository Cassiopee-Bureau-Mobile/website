export interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    danger?: boolean;
    disabled?: boolean;
    confirm?: boolean;
    type?: 'button' | 'submit' | 'reset';
    fillPercentage?: number;
    loading?: boolean;
}

export const Button = ({ children, onClick, danger, disabled, type, fillPercentage, confirm, loading }: ButtonProps) => {
    const _danger = danger ?? false;
    const _disabled = (disabled || loading) ?? false;
    const _validate = confirm ?? false;

    const className =
        'text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 transition ease-in duration-200 rounded-md shadow-md transform enabled:hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed focus:outline-1';

    let specificClassName = '';
    if (_danger) {
        specificClassName = 'bg-red-600 hover:bg-red-800 disabled:bg-red-800 border-red-600 focus:outline-red-600';
    } else if (_validate) {
        specificClassName = 'bg-green-600 hover:bg-green-800 disabled:bg-green-800 border-green-600 focus:outline-green-600';
    } else {
        specificClassName = 'bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-800 border-cyan-600 focus:outline-cyan-600';
    }

    let fillPercentageClassName = '';
    if (_danger) {
        fillPercentageClassName = disabled ? 'bg-red-900' : 'bg-red-800';
    } else if (_validate) {
        fillPercentageClassName = disabled ? 'bg-green-900' : 'bg-green-800';
    } else {
        fillPercentageClassName = disabled ? 'bg-cyan-700' : 'bg-cyan-800';
    }

    return (
        <button
            className={`${specificClassName} ${className}`}
            disabled={_disabled}
            type={type}
            onClick={onClick}>
            {fillPercentage ? (
                <div className='relative'>
                    <div
                        className={`absolute inset-0 rounded-md ${fillPercentageClassName}`}
                        style={{ width: `${fillPercentage}%` }}></div>
                    <div className='relative px-4 py-2 flex justify-center'>
                        {children}
                        <Loading loading={loading} />
                    </div>
                </div>
            ) : (
                <div className='px-4 py-2 flex justify-center'>
                    {children}
                    <Loading loading={loading} />
                </div>
            )}
        </button>
    );
};

function Loading({ loading }: { loading?: boolean }) {
    if (loading === undefined || !loading) return <></>;
    return (
        <svg
            className='animate-spin mx-5 h-5 w-5 text-white'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'>
            <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'></circle>
            <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
        </svg>
    );
}
