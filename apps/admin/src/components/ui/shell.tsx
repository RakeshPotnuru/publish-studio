import { cn } from "@itsrakesh/utils";

type ShellProps = React.HTMLAttributes<HTMLDivElement>;

export function Shell({ children, className, ...props }: Readonly<ShellProps>) {
  return (
    <div className={cn("rounded-3xl bg-background p-8", className)} {...props}>
      {children}
    </div>
  );
}

export function MenuShell({ children, className }: Readonly<ShellProps>) {
  return (
    <div className={cn("flex flex-row space-x-1", className)}>{children}</div>
  );
}
