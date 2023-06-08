interface SkeletonProps {
    width?: string;
    height?: string;
    className?: string;
    id?: string;
}

export default function Skeleton(props: SkeletonProps): JSX.Element {
    return (
        <span
            style={{
                width: props.width,
                height: props.height
            }}
            className={'mx-2 h-2.5 animate-pulse bg-gray-300 rounded-full ' + props.className}>
            {props.id !== undefined ? (
                <input
                    hidden
                    id={props.id}></input>
            ) : (
                <></>
            )}
        </span>
    );
}
