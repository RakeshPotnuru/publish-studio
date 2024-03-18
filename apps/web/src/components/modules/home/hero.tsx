import Link from "next/link";

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
          className="mt-24 sm:mt-8 text-center"
        >
          <div className="flex flex-col space-y-10">
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
