"use client";

import Link from "next/link";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";

import { ScrollArea } from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";

type SidebarProps = React.HTMLAttributes<HTMLElement>;

const SidebarItem = ({
  label,
  link,
  ...props
}: {
  label: string;
  link: string;
} & React.HTMLAttributes<HTMLElement>) => {
  const path = usePathname();
  const segment = useSelectedLayoutSegment();

  return (
    <div>
      <Link
        href={link}
        className={cn(
          "flex w-full cursor-pointer flex-row items-center space-x-4 rounded-lg px-4 py-2 font-medium",
          {
            "bg-primary text-background":
              path === link ||
              (link === "/" && !path) ||
              segment === label.toLowerCase(),
            "hover:bg-muted": path !== link && (link !== "/" || path),
          }
        )}
        {...props}
      >
        <span>{label}</span>
      </Link>
    </div>
  );
};

export function Sidebar({ className, ...props }: Readonly<SidebarProps>) {
  return (
    <aside
      className={cn(
        "sticky top-8 flex h-[85dvh] flex-row rounded-xl bg-background",
        className
      )}
      {...props}
    >
      <ScrollArea className="h-max w-full">
        <div className="space-y-2 p-4">
          <SidebarItem label="Dashboard" link="/" />
        </div>
      </ScrollArea>
    </aside>
  );
}
