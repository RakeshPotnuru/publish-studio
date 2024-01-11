interface ProTextProps extends React.HTMLAttributes<HTMLSpanElement> {}

export function ProText({ children, ...props }: ProTextProps) {
    return (
        <span
            className="from-primary bg-gradient-to-r via-purple-500 to-blue-500 bg-clip-text text-transparent"
            {...props}
        >
            {children}
        </span>
    );
}
