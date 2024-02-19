import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="m-4 flex items-center justify-between">
      <Link href="/">
        <Image
          src="/images/logo.webp"
          alt="Publish Studio logo"
          width={50}
          height={50}
        />
      </Link>
      <div className="flex items-center space-x-4">
        <Link href="https://docs.publishstudio.one" target="_blank">
          Docs
        </Link>
        <Link href="mailto:support@publishstudio.one">Support</Link>
      </div>
    </nav>
  );
}
