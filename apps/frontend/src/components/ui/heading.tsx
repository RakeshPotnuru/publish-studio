interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
    level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function Heading({ level, children, ...props }: HeadingProps) {
    switch (level) {
        case 1:
            return (
                <h1 className="text-3xl font-semibold" {...props}>
                    {children}
                </h1>
            );
        case 2:
            return (
                <h2 className="text-2xl font-semibold" {...props}>
                    {children}
                </h2>
            );
        case 3:
            return (
                <h3 className="text-xl font-semibold" {...props}>
                    {children}
                </h3>
            );
        case 4:
            return (
                <h4 className="text-lg font-semibold" {...props}>
                    {children}
                </h4>
            );
        case 5:
            return (
                <h5 className="text-base font-semibold" {...props}>
                    {children}
                </h5>
            );
        case 6:
            return (
                <h6 className="text-sm font-semibold" {...props}>
                    {children}
                </h6>
            );
        default:
            return (
                <h1 className="text-3xl font-semibold" {...props}>
                    {children}
                </h1>
            );
    }
}
