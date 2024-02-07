import {
  Button,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@itsrakesh/ui";

import { Icons } from "@/assets/icons";

interface InfoCardProps {
  content: React.ReactNode;
}

export function InfoCard({ content }: Readonly<InfoCardProps>) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          variant="link"
          className="h-max p-0 text-foreground"
          aria-label="more information about field"
        >
          <Icons.Question />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-44" side="right">
        {content}
      </HoverCardContent>
    </HoverCard>
  );
}
