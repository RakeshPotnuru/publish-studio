import { cn } from "@itsrakesh/utils";

import { ErrorBox } from "@/components/ui/error-box";

interface DashboardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  error?: string;
  children: React.ReactNode;
}

export function DashboardBody({
  children,
  error,
  className,
}: DashboardBodyProps) {
  return error ? (
    <div className={cn("flex h-[70vh] items-center justify-center", className)}>
      <ErrorBox title="Error" description={error} />
    </div>
  ) : (
    children
  );
}
