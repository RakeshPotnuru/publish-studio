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
    Skeleton,
} from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import useUserStore from "@/lib/store/user";
import { trpc } from "@/utils/trpc";
import { useCookies } from "react-cookie";
import { Icons } from "../../../assets/icons";
import { Images } from "../../../assets/images";
import { Tooltip } from "../tooltip";

const NavItem = ({ icon, tooltip }: { icon: React.ReactNode; tooltip: string }) => (
    <Tooltip content={tooltip}>
        <Button size="icon" variant="ghost" className="rounded-full">
            {icon}
        </Button>
    </Tooltip>
);

interface NavbarProps extends React.HTMLAttributes<HTMLElement> {}

export function Navbar({ className, ...props }: NavbarProps) {
    const [_, __, removeCookie] = useCookies(["ps_access_token"]);

    const { mutateAsync: logout } = trpc.logout.useMutation();
    const { user, setUser, setIsLoading } = useUserStore();

    const { isFetching } = trpc.getUser.useQuery(undefined, {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
        onSuccess: data => {
            setUser({
                _id: data.data.user._id,
                first_name: data.data.user.first_name,
                last_name: data.data.user.last_name,
                email: data.data.user.email,
                profile_pic: data.data.user.profile_pic,
            });
            setIsLoading(false);
        },
    });

    const handleLogout = async () => {
        try {
            await logout();

            removeCookie("ps_access_token");

            window.google?.accounts.id.disableAutoSelect();
            window.location.href = siteConfig.pages.login.link;
        } catch (error) {}
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
            <div className="flex flex-row items-center space-x-1">
                <NavItem icon={<Icons.Question className="h-5 w-5" />} tooltip="Help" />
                <NavItem
                    icon={<Icons.Notifications className="h-5 w-5" />}
                    tooltip="Notifications"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-9 w-9">
                                <AvatarImage
                                    src={user?.profile_pic}
                                    alt={`${user?.first_name} ${user?.last_name}`}
                                />
                                {isFetching ? (
                                    <AvatarFallback>
                                        <Skeleton className="h-4 w-4 animate-ping rounded-full" />
                                    </AvatarFallback>
                                ) : (
                                    <AvatarFallback>
                                        {user?.first_name?.charAt(0)}
                                        {user?.last_name.charAt(0)}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48" align="end" forceMount>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/profile">
                                <Icons.Profile className="mr-2 h-4 w-4" />
                                Profile
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/settings">
                                <Icons.Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            <Icons.Logout className="mr-2 h-4 w-4" />
                            <span>Logout</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    );
}
