"use client";

import { cn } from "@itsrakesh/utils";
import Image from "next/image";
import { AiFillBell, AiFillQuestionCircle } from "react-icons/ai";
import { Avatar, AvatarFallback, AvatarImage, Button } from "@itsrakesh/ui";
import Link from "next/link";

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
            <div className="flex flex-row items-center space-x-1 text-gray-700">
                <Button size="icon" variant="ghost" className="rounded-full">
                    <AiFillQuestionCircle className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="ghost" className="rounded-full">
                    <AiFillBell className="h-5 w-5" />
                </Button>
                <Avatar>
                    <AvatarImage src="https://github.com/rakeshpotnuru.png" alt="@rakeshpotnuru" />
                    <AvatarFallback>RP</AvatarFallback>
                </Avatar>
            </div>
        </nav>
    );
}
