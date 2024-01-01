"use client";

import { useToast } from "@itsrakesh/ui";
import { useRouter, useSearchParams } from "next/navigation";

import { DotsLoader } from "@/components/ui/loaders/dots-loader";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";
import { useCallback, useEffect } from "react";

export function ConnectWP() {
    const searchParams = useSearchParams();

    const router = useRouter();
    const code = searchParams.get("code");

    const { toast } = useToast();
    const utils = trpc.useUtils();

    const { mutateAsync: connect } = trpc.connectWordPress.useMutation({
        onSuccess() {
            toast({
                variant: "success",
                title: "Connected",
                description: "Your WordPress account has been connected successfully.",
            });
            utils.getAllPlatforms.invalidate();
            router.push(siteConfig.pages.settings.integrations.link);
        },
        onError(error) {
            toast({
                variant: "destructive",
                title: "Failed to connect",
                description: error.message,
            });
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
