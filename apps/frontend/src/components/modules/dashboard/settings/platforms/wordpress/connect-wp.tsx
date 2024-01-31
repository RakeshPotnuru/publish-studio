"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "@itsrakesh/ui";

import { DotsLoader } from "@/components/ui/loaders/dots-loader";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";
import { useCallback, useEffect } from "react";

export function ConnectWP() {
    const searchParams = useSearchParams();

    const router = useRouter();
    const code = searchParams.get("code");

    const utils = trpc.useUtils();

    const { mutateAsync: connect } = trpc.platforms.wordpress.connect.useMutation({
        onSuccess: async ({ data }) => {
            toast.success(data.message);
            await utils.platforms.getAll.invalidate();
            router.push(siteConfig.pages.settings.connections.link);
        },
        onError: error => {
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
        } catch (error) {}
    }, [code, connect]);

    useEffect(() => {
        if (!code) {
            router.replace(siteConfig.pages.settings.connections.link);
        }

        (async () => {
            await handleConnect();
        })();
    }, [code, handleConnect, router]);

    return (
        <div className="flex h-[75vh] items-center justify-center">
            <DotsLoader />
        </div>
    );
}
