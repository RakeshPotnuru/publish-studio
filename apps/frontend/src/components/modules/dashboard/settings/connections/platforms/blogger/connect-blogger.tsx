"use client";

import { useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "@itsrakesh/ui";

import { DotsLoader } from "@/components/ui/loaders/dots-loader";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";

import { useResetUser } from "../use-reset-user";

export function ConnectBlogger() {
  const searchParams = useSearchParams();

  const router = useRouter();
  const code = searchParams.get("code");

  const utils = trpc.useUtils();
  const { resetUser } = useResetUser();

  const { mutateAsync: connect } = trpc.platforms.blogger.connect.useMutation({
    onSuccess: async ({ data }) => {
      toast.success(data.message);
      await utils.platforms.getAll.invalidate();

      await resetUser();

      router.push(siteConfig.pages.settings.connections.link);
    },
    onError: (error) => {
      toast.error(error.message);
      router.replace(siteConfig.pages.settings.connections.link);
    },
  });

  const handleConnect = useCallback(async () => {
    if (!code) {
      return;
    }

    try {
      await connect(code);
    } catch {
      // Ignore
    }
  }, [code, connect]);

  useEffect(() => {
    if (!code) {
      router.replace(siteConfig.pages.settings.connections.link);
    }

    handleConnect().catch(() => {
      // Ignore
    });
  }, [code, handleConnect, router]);

  return (
    <div className="flex h-[75vh] items-center justify-center">
      <DotsLoader />
    </div>
  );
}
