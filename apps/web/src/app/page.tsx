import Image from "next/image";
import Link from "next/link";

import { Home } from "@/components/modules/home";

export default function HomePage() {
  return (
    <main>
      <nav className="m-4 flex items-center justify-between">
        <Image
          src="/images/logo.webp"
          alt="Publish Studio logo"
          width={50}
          height={50}
        />
        <div className="flex items-center space-x-4">
          <Link href="https://docs.publishstudio.one" target="_blank">
            Docs
          </Link>
          <Link href="mailto:support@publishstudio.one">Support</Link>
        </div>
      </nav>
      <Home />
    </main>
  );
}
