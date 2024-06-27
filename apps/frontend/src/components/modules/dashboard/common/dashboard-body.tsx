import { ErrorBox } from "@/components/ui/error-box";

interface DashboardBodyProps {
  error?: string;
  children: React.ReactNode;
}

export function DashboardBody({ children, error }: DashboardBodyProps) {
  return error ? (
    <div className="flex h-[70vh] items-center justify-center">
      <ErrorBox title="Error" description={error} />
    </div>
  ) : (
    children
  );
}
