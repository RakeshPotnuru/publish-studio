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
import { deleteCookie } from "cookies-next";

import { Icons } from "@/assets/icons";
import { Images } from "@/assets/images";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";

type NavbarProps = React.HTMLAttributes<HTMLElement>;

const handleLogout = () => {
  try {
    deleteCookie("ps_access_token", { path: "/" });
    deleteCookie("ps_refresh_token", { path: "/" });

    window.location.href = siteConfig.pages.login.link;
  } catch {
    // Ignore
  }
};

export function Navbar({ className, ...props }: Readonly<NavbarProps>) {
  const { isFetching, data } = trpc.auth.getMe.useQuery(undefined, {
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        handleLogout();
      }
    },
  });

  const user = data?.data.user;

  return (
    <nav
      className={cn(
        "mx-12 mt-4 flex items-center justify-between rounded-2xl bg-background px-8 py-4 shadow-lg",
        className
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
      </div>
      <div className="flex flex-row items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative size-8 rounded-full">
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
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" align="end" forceMount>
            <DropdownMenuLabel className="grid grid-cols-2 items-center">
              My Account
            </DropdownMenuLabel>
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
