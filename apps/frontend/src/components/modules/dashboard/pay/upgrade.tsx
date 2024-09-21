"use client";

import { useRouter } from "next/navigation";

import { UserType } from "@publish-studio/core/src/config/constants";

import { FullScreenLoader } from "@/components/ui/loaders/full-screen-loader";
import { siteConfig } from "@/config/site";
import useUserStore from "@/lib/stores/user";
import { isOnFreeTrial } from "@/utils/is-on-free-trial";

export default function Upgrade({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const { user } = useUserStore();

  if (user?.user_type === UserType.FREE && !isOnFreeTrial(user)) {
    router.push(siteConfig.pages.pay.link);
  } else {
    return <>{children}</>;
  }

  return <FullScreenLoader />;
}
