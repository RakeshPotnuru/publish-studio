"use client";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import Image from "next/image";
import Link from "next/link";

import { Icons } from "./icons";
import { Tooltip } from "./tooltip";

const NavItem = ({ icon, tooltip }: { icon: React.ReactNode; tooltip: string }) => (
    <Tooltip content={tooltip}>
        <Button size="icon" variant="ghost" className="rounded-full">
            {icon}
        </Button>
    </Tooltip>
);

interface NavbarProps extends React.HTMLAttributes<HTMLElement> {}

export function Navbar({ className, ...props }: NavbarProps) {
    return (
        <nav
            className={cn(
                "bg-background mx-12 mt-4 flex items-center justify-between rounded-2xl px-8 py-4 shadow-lg",
                className,
            )}
            {...props}
        >
            <Link href="/">
                <Image
                    src="/images/logo.png"
                    alt="Publish Studio"
                    width={35}
                    height={35}
                    className="rounded-md drop-shadow-md"
                />
            </Link>
            <div className="flex flex-row items-center space-x-1 text-gray-700 dark:text-gray-300">
                <NavItem icon={<Icons.question className="h-5 w-5" />} tooltip="Help" />
                <NavItem
                    icon={<Icons.notifications className="h-5 w-5" />}
                    tooltip="Notifications"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-9 w-9">
                                <AvatarImage
                                    src="https://github.com/rakeshpotnuru.png"
                                    alt="@rakeshpotnuru"
                                />
                                <AvatarFallback>RP</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48" align="end" forceMount>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href="/profile">
                            <DropdownMenuItem>
                                <Icons.profile className="mr-2 h-4 w-4" />
                                Profile
                            </DropdownMenuItem>
                        </Link>
                        <Link href="/settings">
                            <DropdownMenuItem>
                                <Icons.settings className="mr-2 h-4 w-4" />
                                Settings
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Icons.logout className="mr-2 h-4 w-4" />
                            <span>Logout</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    );
}