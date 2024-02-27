import Image from "next/image";
import Link from "next/link";

import { Images } from "@/assets/images";
import { MagicBorderBtn } from "@/components/ui/magic-border-btn";

export function Navbar() {
  return (
    <nav className="flex w-full items-center justify-between px-10 pt-6 sm:px-48">
      <Link href="/">
        <Image
          src={Images.logo}
          alt="Publish Studio logo"
          width={35}
          height={35}
        />
      </Link>
      <div className="flex items-center space-x-4">
        <Link href="https://docs.publishstudio.one" target="_blank">
          Docs
        </Link>
        <Link href="mailto:support@publishstudio.one?subject=%5BLANDING%5D%3A%20Write%20your%20subject%20here">
          Support
        </Link>
        <Link href="/#cta">
          <MagicBorderBtn>Join waitlist</MagicBorderBtn>
        </Link>
      </div>
    </nav>
  );
}
