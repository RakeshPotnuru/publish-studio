import { Heading } from "@/components/ui/heading";

interface DashboardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  action?: React.ReactNode;
}

export function DashboardHeader({ title, action }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <Heading>{title}</Heading>
      {action}
    </div>
  );
}
