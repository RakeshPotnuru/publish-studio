interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AuthShell({ children, ...props }: ShellProps) {
    return (
        <div
            className="bg-background dark:bg-background-dark container mx-auto flex w-full flex-col justify-center space-y-6 rounded-lg p-14 shadow-xl sm:w-[500px]"
            {...props}
        >
            {children}
        </div>
    );
}
