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
import { UserType } from "@publish-studio/core/src/config/constants";
import { deleteCookie } from "cookies-next";

import { Icons } from "@/assets/icons";
import { ProBorder } from "@/components/ui/pro-border";
import { Tooltip } from "@/components/ui/tooltip";
import { siteConfig } from "@/config/site";
import useUserStore from "@/lib/store/user";
import { trpc } from "@/utils/trpc";

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

export default function AccountMenu() {
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative size-8 rounded-full">
          <ProBorder className="rounded-full">
            <Avatar>
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
  );
}
