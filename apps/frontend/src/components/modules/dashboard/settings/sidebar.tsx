"use client";

import { ScrollArea } from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { FaPaintRoller, FaPuzzlePiece } from "react-icons/fa";

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
    const segment = useSelectedLayoutSegment();

    return (
        <div>
            <Link
                href={`/settings/${link}`}
                className={cn(
                    "flex w-full cursor-pointer flex-row items-center space-x-4 rounded-lg px-4 py-2 text-lg font-medium",
                    {
                        "bg-primary text-background": segment === link,
                        "hover:bg-secondary": segment !== link,
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
    return (
        <aside
            className={cn("bg-background sticky top-0 flex h-max flex-row rounded-xl", className)}
            {...props}
        >
            <ScrollArea className="h-max w-full">
                <div className="space-y-4 p-4">
                    <SidebarItem label="Appearance" link="appearance" icon={<FaPaintRoller />} />
                    <SidebarItem
                        label="Integrations"
                        link="integrations"
                        icon={<FaPuzzlePiece />}
                    />
                </div>
            </ScrollArea>
        </aside>
    );
}
