"use client";

import { toast } from "@itsrakesh/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";

import { DotsLoader } from "@/components/ui/loaders/dots-loader";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";

export function ConnectBlogger() {
    const searchParams = useSearchParams();

    const router = useRouter();
    const code = searchParams.get("code");

    const utils = trpc.useUtils();

    const { mutateAsync: connect } = trpc.platforms.blogger.connect.useMutation({
        onSuccess() {
            toast.success("Your Blogger account has been connected successfully.");
            utils.platforms.getAll.invalidate();
            router.push(siteConfig.pages.settings.integrations.link);
        },
        onError(error) {
            toast.error(error.message);
            router.replace(siteConfig.pages.settings.integrations.link);
        },
    });

    const handleConnect = useCallback(async () => {
        if (!code) {
            return;
        }

        try {
            await connect(code);
        } catch (error) {}
    }, [code, connect]);

    useEffect(() => {
        if (!code) {
            router.replace(siteConfig.pages.settings.integrations.link);
        }

        handleConnect();
    }, [code, handleConnect, router]);

    return (
        <div className="flex h-[75vh] items-center justify-center">
            <DotsLoader />
        </div>
    );
}
