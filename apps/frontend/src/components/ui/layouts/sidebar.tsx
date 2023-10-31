"use client";

import { ScrollArea } from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import Link from "next/link";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";

import { Icons } from "@/assets/icons";

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {}

const SidebarItem = ({
    label,
    link,
    icon,
    ...props
}: {
    label: string;
    link: string;
    icon: React.ReactNode;
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
                    },
                )}
                {...props}
            >
                {icon}
                <span>{label}</span>
            </Link>
        </div>
    );
};

export function Sidebar({ className, ...props }: SidebarProps) {
    const segment = useSelectedLayoutSegment();

    return (
        <aside
            className={cn(
                "bg-background sticky top-8 flex h-[85vh] flex-row rounded-xl",
                className,
            )}
            {...props}
        >
            <ScrollArea className="h-max w-full">
                <div className="space-y-2 p-4">
                    {segment === "settings" ? (
                        <>
                            <SidebarItem
                                label="Appearance"
                                link="/settings/appearance"
                                icon={<Icons.appearance />}
                            />
                            <SidebarItem
                                label="Integrations"
                                link="/settings/integrations"
                                icon={<Icons.integrations />}
                            />
                        </>
                    ) : (
                        <>
                            <SidebarItem label="Dashboard" link="/" icon={<Icons.dashboard />} />
                            <SidebarItem
                                label="Projects"
                                link="/projects"
                                icon={<Icons.projects />}
                            />
                            <SidebarItem label="Folders" link="/folders" icon={<Icons.folders />} />
                            <SidebarItem label="Assets" link="/assets" icon={<Icons.assets />} />
                        </>
                    )}
                </div>
            </ScrollArea>
        </aside>
    );
}
