interface IconProps {
    className: string;
}

const SettingsIcon = (props: IconProps): JSX.Element => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            style={{ maxWidth: '3rem', maxHeight: '3rem' }}
            className={props.className}>
            <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z'
            />
            <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
            />
        </svg>
    );
};

const ClipboardIcon = (props: IconProps): JSX.Element => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            style={{ maxWidth: '3rem', maxHeight: '3rem' }}
            className={props.className}>
            <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z'
            />
        </svg>
    );
};

const RoundArrowIcon = (props: IconProps): JSX.Element => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            style={{ maxWidth: '3rem', maxHeight: '3rem' }}
            className={props.className}>
            <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3'
            />
        </svg>
    );
};

const NoteIcon = (props: IconProps): JSX.Element => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            style={{ maxWidth: '3rem', maxHeight: '3rem' }}
            className={props.className}>
            <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z'
            />
        </svg>
    );
};

const PerformanceIcon = (props: IconProps): JSX.Element => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            style={{ maxWidth: '3rem', maxHeight: '3rem' }}
            className={props.className}>
            <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6'
            />
        </svg>
    );
};

const DashboardIcon = (props: IconProps): JSX.Element => {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            style={{ maxWidth: '3rem', maxHeight: '3rem' }}
            className={props.className}>
            <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605'
            />
        </svg>
    );
};

const AccountIcon = (props: IconProps): JSX.Element => {
    return (
        <svg
            className={props.className}
            fill='currentColor'
            style={{ maxWidth: '3rem', maxHeight: '3rem' }}
            viewBox='0 0 24 24'>
            <path d='M10 12q-1.65 0-2.825-1.175Q6 9.65 6 8q0-1.65 1.175-2.825Q8.35 4 10 4q1.65 0 2.825 1.175Q14 6.35 14 8q0 1.65-1.175 2.825Q11.65 12 10 12Zm-7 8q-.425 0-.712-.288Q2 19.425 2 19v-1.8q0-.825.425-1.55q.425-.725 1.175-1.1q1.275-.65 2.875-1.1Q8.075 13 10 13h.35q.15 0 .3.05q-.2.45-.338.938q-.137.487-.212 1.012q-.125.9-.075 1.512q.05.613.275 1.488q.15.525.4 1.038q.25.512.55.962Zm14-2q.825 0 1.413-.587Q19 16.825 19 16q0-.825-.587-1.413Q17.825 14 17 14q-.825 0-1.412.587Q15 15.175 15 16q0 .825.588 1.413Q16.175 18 17 18Zm-1.3 1.5q-.3-.125-.563-.262q-.262-.138-.537-.338l-1.075.325q-.175.05-.325-.013q-.15-.062-.25-.212l-.6-1q-.1-.15-.062-.325q.037-.175.187-.3l.825-.725q-.05-.35-.05-.65q0-.3.05-.65l-.825-.725q-.15-.125-.187-.3q-.038-.175.062-.325l.6-1q.1-.15.25-.213q.15-.062.325-.012l1.075.325q.275-.2.537-.338q.263-.137.563-.262l.225-1.1q.05-.175.175-.287q.125-.113.3-.113h1.2q.175 0 .3.113q.125.112.175.287l.225 1.1q.3.125.563.275q.262.15.537.375l1.05-.375q.175-.075.338 0q.162.075.262.225l.6 1.05q.1.15.075.325q-.025.175-.175.3l-.85.725q.05.3.05.625t-.05.625l.825.725q.15.125.187.3q.038.175-.062.325l-.6 1q-.1.15-.25.212q-.15.063-.325.013L19.4 18.9q-.275.2-.537.338q-.263.137-.563.262l-.225 1.1q-.05.175-.175.287q-.125.113-.3.113h-1.2q-.175 0-.3-.113q-.125-.112-.175-.287Z'></path>
        </svg>
    );
};

// Geter for the icons

export function getIcon(name: icon, className: string = 'w-5 h-5'): JSX.Element {
    switch (name) {
        case 'settings':
            return <SettingsIcon className={className} />;
        case 'clipboard':
            return <ClipboardIcon className={className} />;
        case 'roundArrow':
            return <RoundArrowIcon className={className} />;
        case 'note':
            return <NoteIcon className={className} />;
        case 'performance':
            return <PerformanceIcon className={className} />;
        case 'dashboard':
            return <DashboardIcon className={className} />;
        case 'account':
            return <AccountIcon className={className} />;
        default:
            return <></>;
    }
}
