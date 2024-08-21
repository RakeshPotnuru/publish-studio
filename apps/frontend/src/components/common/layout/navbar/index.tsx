"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@itsrakesh/ui";

import { Icons } from "@/assets/icons";
import { Images } from "@/assets/images";
import { Tooltip } from "@/components/ui/tooltip";
import { siteConfig } from "@/config/site";

import AccountMenu from "./account-menu";
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
          className="h-8 w-8 rounded-full"
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

export function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b bg-background px-8 py-1 shadow-lg">
      <Link href="/">
        <Image
          src={Images.logo}
          alt="Publish Studio"
          width={25}
          height={25}
          className="rounded-md drop-shadow-md"
          priority
        />
      </Link>

      <div className="flex flex-row items-center space-x-1">
        <Tooltip content="Report a bug">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full"
            aria-label="Report a bug"
            asChild
          >
            <Link href={siteConfig.links.bugReport} target="_blank">
              <Icons.Bug className="size-4" />
            </Link>
          </Button>
        </Tooltip>
        <NavItem icon={<Icons.Question className="size-4" />} tooltip="Help">
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
        <AccountMenu />
      </div>
    </nav>
  );
}
