import { cn } from "@itsrakesh/utils";

import { Center } from "@/components/ui/center";
import { ErrorBox } from "@/components/ui/error-box";
import { Heading } from "@/components/ui/heading";

interface StatsShellProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: string;
  error?: string;
}

export default function StatsShell({
  children,
  className,
  heading,
  error,
}: Readonly<StatsShellProps>) {
  return error ? (
    <Center>
      <ErrorBox title="Error fetching stats" description={error} />
    </Center>
  ) : (
    <div className={cn("flex flex-col items-center space-y-4", className)}>
      <Heading level={2} className="float-left w-full text-xl">
        {heading}
      </Heading>
      {children}
    </div>
  );
}
