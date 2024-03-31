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
import { deleteCookie } from "cookies-next";

import { Icons } from "@/assets/icons";
import { Images } from "@/assets/images";
import { ProBorder } from "@/components/ui/pro-border";
import { Tooltip } from "@/components/ui/tooltip";
import { siteConfig } from "@/config/site";
import useUserStore from "@/lib/store/user";
import { trpc } from "@/utils/trpc";

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
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full"
          aria-label={tooltip}
        >
          {icon}
        </Button>
      </DropdownMenuTrigger>
    </Tooltip>
    <DropdownMenuContent
      className="w-48"
      onCloseAutoFocus={(e) => e.preventDefault()}
      forceMount
    >
      {children}
    </DropdownMenuContent>
  </DropdownMenu>
);

interface NavbarProps extends React.HTMLAttributes<HTMLElement> {}

export function Navbar({ className, ...props }: Readonly<NavbarProps>) {
  const { user, setUser, setIsLoading } = useUserStore();

  const { isFetching } = trpc.auth.getMe.useQuery(undefined, {
    onSuccess: ({ data }) => {
      setUser(data.user);
      setIsLoading(false);
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        handleLogout();
      }
      setIsLoading(false);
    },
  });

  const handleLogout = () => {
    try {
      deleteCookie("ps_access_token", { path: "/" });
      deleteCookie("ps_refresh_token", { path: "/" });

      window.google?.accounts.id.disableAutoSelect();
      window.location.href = siteConfig.pages.login.link;
    } catch {
      // Ignore
    }
  };

  return (
    <nav
      className={cn(
        "mx-12 mt-4 flex items-center justify-between rounded-2xl bg-background px-8 py-4 shadow-lg",
        className,
      )}
      {...props}
    >
      <div className="flex flex-row items-start space-x-1">
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

        <div className="-mt-2 select-none rounded-md bg-secondary p-1 py-[0.5px] text-xs font-bold">
          Beta
        </div>
      </div>
      <div className="flex flex-row items-center space-x-2">
        {/* NOSONAR */}
        {/* {isFetching ||
          (user?.user_type !== UserType.PRO && (
            <ProButton size="sm">
              <Icons.Pro className="mr-2 size-4" />
              Upgrade
            </ProButton>
          ))} */}
        <Tooltip content="Report a bug">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full"
            aria-label="Report a bug"
            asChild
          >
            <Link href={siteConfig.links.bugReport} target="_blank">
              <Icons.Bug className="size-5" />
            </Link>
          </Button>
        </Tooltip>
        <NavItem icon={<Icons.Question className="size-5" />} tooltip="Help">
          <DropdownMenuItem asChild>
            <Link href={siteConfig.links.support}>
              <Icons.Support className="mr-2 size-4" />
              Support
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={siteConfig.links.docs} target="_blank">
              <Icons.Docs className="mr-2 size-4" />
              Docs
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
                  <AvatarFallback>
                    {isFetching ? (
                      <Skeleton className="size-4 animate-ping rounded-full" />
                    ) : (
                      <>
                        {user?.first_name.charAt(0)}
                        {user?.last_name.charAt(0)}
                      </>
                    )}
                  </AvatarFallback>
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
