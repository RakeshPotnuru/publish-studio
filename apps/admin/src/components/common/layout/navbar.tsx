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
  toast,
} from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";

import { Icons } from "@/assets/icons";
import { Images } from "@/assets/images";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";

type NavbarProps = React.HTMLAttributes<HTMLElement>;

export function Navbar({ className, ...props }: Readonly<NavbarProps>) {
  const { isFetching, data } = trpc.auth.getMe.useQuery(undefined, {
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        handleLogout().catch(() => {
          // ignore
        });
      }
    },
  });

  const user = data?.data.user;

  const { mutateAsync: logout, isLoading } = trpc.auth.logout.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleLogout = async () => {
    try {
      await logout();

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
            <DropdownMenuItem onClick={handleLogout} disabled={isLoading}>
              <Icons.Logout className="mr-2 size-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
