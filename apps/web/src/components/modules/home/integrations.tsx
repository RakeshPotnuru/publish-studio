import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

import { cn } from "@itsrakesh/utils";
import { motion } from "framer-motion";

import { Images } from "@/assets/images";

const IntegrationCard = ({
  image,
  alt,
  className,
  index,
}: {
  image: string | StaticImport;
  alt: string;
  index: number;
  className?: string;
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
      className={cn(
        "bg-slate-800 p-10 items-center flex justify-center",
        className
      )}
    >
      <Image src={image} alt={alt} width={150} height={150} />
    </motion.div>
  );
};

export function Integrations() {
  return (
    <div className="relative mx-10 flex items-center justify-center bg-white py-40 bg-grid-black/[0.2] dark:bg-black dark:bg-grid-white/[0.2]">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
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
        <div className="relative z-20 flex flex-col space-y-20">
          <h1 className="bg-gradient-to-br from-slate-200 to-slate-400 bg-clip-text pb-4 text-5xl font-medium tracking-tight text-transparent">
            Your favorite media tools, <br /> integrated.
          </h1>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <IntegrationCard
              image={Images.cloudinaryLogo}
              alt="Cloudinary logo"
              index={1}
              className="bg-cloudinary"
            />
            <IntegrationCard
              image={Images.imagekitLogo}
              alt="Imagekit logo"
              index={2}
              className="bg-white"
            />
            <IntegrationCard
              image={Images.pexelsLogo}
              alt="Pexels logo"
              index={3}
              className="bg-pexels"
            />
            <IntegrationCard
              image={Images.unsplashLogo}
              alt="Unsplash logo"
              index={4}
              className="bg-unsplash"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
