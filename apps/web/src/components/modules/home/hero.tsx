import Link from "next/link";

import { Button } from "@itsrakesh/ui";
import { motion } from "framer-motion";

import { LampContainer } from "@/components/ui/lamp";
import { MagicBorderBtn } from "@/components/ui/magic-border-btn";

export function Hero() {
  return (
    <div className="w-full">
      <LampContainer>
        <motion.div
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mt-8 text-center"
        >
          <div className="flex flex-col space-y-10">
            <Button
              className="group relative inline-block max-w-max cursor-pointer self-center rounded-full bg-slate-800 p-px text-xs font-semibold leading-6 text-white no-underline shadow-2xl shadow-zinc-900"
              asChild
            >
              <Link
                href="https://medium.com/@itsrakesh/introducing-publish-studio-56681e27e767"
                target="_blank"
              >
                <span className="absolute inset-0 overflow-hidden rounded-full">
                  <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </span>
                <div className="relative z-10 flex items-center space-x-2 rounded-full bg-zinc-950 px-4 py-0.5 ring-1 ring-white/10 ">
                  <span>
                    ✨NEW✨ - Publish Studio is now in closed beta. Read the
                    announcement article and join the waitlist.
                  </span>
                  <svg
                    fill="none"
                    height="16"
                    viewBox="0 0 24 24"
                    width="16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.75 8.75L14.25 12L10.75 15.25"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
                <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
              </Link>
            </Button>
            <h1 className="bg-gradient-to-br from-rose-300 to-rose-500 bg-clip-text py-4 text-4xl font-medium tracking-tight text-transparent md:text-8xl">
              Craft. Curate. Connect.
            </h1>
            <p className="text-slate-500">
              Seamlessly create captivating stories, and connect with your
              audience like never before.
            </p>
            <Link href="/#cta">
              <MagicBorderBtn>Join waitlist</MagicBorderBtn>
            </Link>
          </div>
        </motion.div>
      </LampContainer>
    </div>
  );
}
