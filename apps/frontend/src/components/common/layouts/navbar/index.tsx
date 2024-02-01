"use client";

import Image from "next/image";
import Link from "next/link";

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
    Skeleton,
} from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import { UserType } from "@publish-studio/core/src/config/constants";
import { useCookies } from "react-cookie";

import { siteConfig } from "@/config/site";
import useUserStore from "@/lib/store/user";
import { trpc } from "@/utils/trpc";

import { Icons } from "../../../../assets/icons";
import { Images } from "../../../../assets/images";
import { ProBorder } from "../../../ui/pro-border";
import { ProButton } from "../../../ui/pro-button";
import { Tooltip } from "../../../ui/tooltip";
import { Notifications } from "./notifications";

const NavItem = ({
    icon,
    tooltip,
    children,
}: {
    icon: React.ReactNode;
    tooltip: string;
    children: React.ReactNode;
}) => (
    <DropdownMenu>
        <Tooltip content={tooltip}>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="rounded-full">
                    {icon}
                </Button>
            </DropdownMenuTrigger>
        </Tooltip>
        <DropdownMenuContent className="w-48" onCloseAutoFocus={e => e.preventDefault()} forceMount>
            {children}
        </DropdownMenuContent>
    </DropdownMenu>
);

type NavbarProps = React.HTMLAttributes<HTMLElement>;

export function Navbar({ className, ...props }: Readonly<NavbarProps>) {
    const removeCookie = useCookies(["ps_access_token"])[2];

    const { user, setUser, setIsLoading } = useUserStore();

    const { isFetching } = trpc.auth.getMe.useQuery(undefined, {
        onSuccess: ({ data }) => {
            setUser(data.user);
            setIsLoading(false);
        },
    });

    const handleLogout = () => {
        try {
            removeCookie("ps_access_token");

            window.google?.accounts.id.disableAutoSelect();
            window.location.href = siteConfig.pages.login.link;
        } catch {
            // Ignore
        }
    };

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
                    src={Images.logo}
                    alt="Publish Studio"
                    width={35}
                    height={35}
                    priority={true}
                    className="rounded-md drop-shadow-md"
                />
            </Link>
            <div className="flex flex-row items-center space-x-2">
                {isFetching ||
                    (user?.user_type !== UserType.PRO && (
                        <ProButton size="sm">
                            <Icons.Pro className="mr-2 size-4" />
                            Upgrade
                        </ProButton>
                    ))}
                <NavItem icon={<Icons.Question className="size-5" />} tooltip="Help">
                    <DropdownMenuItem asChild>
                        <Link href={siteConfig.links.support}>
                            <Icons.Support className="mr-2 size-4" />
                            Support
                        </Link>
                    </DropdownMenuItem>
                </NavItem>
                <Notifications />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative size-8 rounded-full">
                            <ProBorder className="rounded-full">
                                <Avatar className="size-9">
                                    <AvatarImage
                                        src={user?.profile_pic}
                                        alt={`${user?.first_name ?? "Publish"} ${
                                            user?.last_name ?? "Studio"
                                        }`}
                                    />
                                    {isFetching ? (
                                        <AvatarFallback>
                                            <Skeleton className="size-4 animate-ping rounded-full" />
                                        </AvatarFallback>
                                    ) : (
                                        <AvatarFallback>
                                            {user?.first_name.charAt(0)}
                                            {user?.last_name.charAt(0)}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                            </ProBorder>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48" align="end" forceMount>
                        <DropdownMenuLabel className="grid grid-cols-2 items-center">
                            My Account{" "}
                            {user?.user_type === UserType.PRO && (
                                <Tooltip content="Pro">
                                    <span>
                                        <Icons.Pro className="mr-2 size-4 text-primary" />
                                    </span>
                                </Tooltip>
                            )}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/profile">
                                <Icons.Profile className="mr-2 size-4" />
                                Profile
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/settings">
                                <Icons.Settings className="mr-2 size-4" />
                                Settings
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            <Icons.Logout className="mr-2 size-4" />
                            <span>Logout</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    );
}
