import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

import { cn } from "@itsrakesh/utils";
import { motion } from "framer-motion";

import { Images } from "@/assets/images";

const PlatformCard = ({
  image,
  alt,
  imgClass,
  index,
}: {
  image: string | StaticImport;
  alt: string;
  index: number;
  imgClass?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0.5, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.2,
        duration: 0.8,
        ease: "easeInOut",
      }}
      className="flex justify-center bg-slate-800 p-10"
    >
      <div className="w-max rounded-full bg-slate-900 p-4">
        <Image
          src={image}
          alt={alt}
          width={50}
          height={50}
          className={cn("rounded-full shadow-lg", imgClass)}
        />
      </div>
    </motion.div>
  );
};

export function Platforms() {
  return (
    <div className="mx-10 my-40">
      <motion.div
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="text-center"
      >
        <div className="relative z-10 -mt-96 flex justify-center">
          <Image
            src={Images.projectPage}
            width={1280}
            height={900}
            alt="project page"
            className="rounded-xl"
          />
        </div>
        <div className="mt-24 flex flex-col space-y-20">
          <h1 className="bg-gradient-to-br from-slate-200 to-slate-400 bg-clip-text pb-4 text-5xl font-medium tracking-tight text-transparent">
            Reach your audience, <br /> wherever they are.
          </h1>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <PlatformCard
              image={Images.mediumLogo}
              alt="Medium logo"
              index={1}
              imgClass="shadow-slate-400"
            />
            <PlatformCard
              image={Images.devLogo}
              alt="Dev.to logo"
              index={2}
              imgClass="shadow-slate-400"
            />
            <PlatformCard
              image={Images.hashnodeLogo}
              alt="Hashnode logo"
              index={3}
              imgClass="shadow-blue-400"
            />
            <PlatformCard
              image={Images.ghostLogo}
              alt="Ghost logo"
              index={4}
              imgClass="invert shadow-green-400"
            />
            <PlatformCard
              image={Images.wordpressLogo}
              alt="WordPress logo"
              index={5}
              imgClass="invert shadow-blue-400"
            />
            <PlatformCard
              image={Images.bloggerLogo}
              alt="Blogger logo"
              index={6}
              imgClass="shadow-rose-400"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
