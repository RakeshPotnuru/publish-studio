"use client";

import Link from "next/link";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";

import { Button, ScrollArea } from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";

import { Icons } from "@/assets/icons";
import { NewAssetDialog } from "@/components/modules/dashboard/assets/new-asset";
import { NewFolderDialog } from "@/components/modules/dashboard/folders/new-folder";
import { NewProject } from "@/components/modules/dashboard/projects/new-project";

type SidebarProps = React.HTMLAttributes<HTMLElement>;

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
                "bg-background sticky top-8 flex h-[85dvh] flex-row rounded-xl",
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
                                icon={<Icons.Appearance />}
                            />
                            <SidebarItem
                                label="Connections"
                                link="/settings/connections"
                                icon={<Icons.Connections />}
                            />
                        </>
                    ) : (
                        <>
                            <SidebarItem label="Dashboard" link="/" icon={<Icons.Dashboard />} />
                            <div className="flex flex-row items-center space-x-2">
                                <div className="w-3/4">
                                    <SidebarItem
                                        label="Projects"
                                        link="/projects"
                                        icon={<Icons.Projects />}
                                    />
                                </div>
                                <NewProject enableTooltip>
                                    <Button variant="ghost" size="icon">
                                        <Icons.Add />
                                    </Button>
                                </NewProject>
                            </div>
                            <div className="flex flex-row items-center space-x-2">
                                <div className="w-3/4">
                                    <SidebarItem
                                        label="Folders"
                                        link="/folders"
                                        icon={<Icons.Folders />}
                                    />
                                </div>
                                <NewFolderDialog enableTooltip>
                                    <Button variant="ghost" size="icon">
                                        <Icons.Add />
                                    </Button>
                                </NewFolderDialog>
                            </div>
                            <div className="flex flex-row items-center space-x-2">
                                <div className="w-3/4">
                                    <SidebarItem
                                        label="Assets"
                                        link="/assets"
                                        icon={<Icons.Assets />}
                                    />
                                </div>
                                <NewAssetDialog enableTooltip>
                                    <Button variant="ghost" size="icon">
                                        <Icons.Add />
                                    </Button>
                                </NewAssetDialog>
                            </div>
                        </>
                    )}
                </div>
            </ScrollArea>
        </aside>
    );
}
