"use client";

import { useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "@itsrakesh/ui";

import { DotsLoader } from "@/components/ui/loaders/dots-loader";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";

export function PaymentSuccess() {
    const searchParams = useSearchParams();

    const router = useRouter();
    const sessionId = searchParams.get("session_id");

    const { mutateAsync: fetchSession } = trpc.payment.getSession.useMutation({
        onSuccess({ data }) {
            if (data.session.payment_status === "paid") {
                toast.success("Payment successful!");
            } else {
                toast.error("Payment failed!");
            }

            router.replace(siteConfig.pages.dashboard.link);
        },
        onError(error) {
            toast.error(error.message);
            router.replace(siteConfig.pages.dashboard.link);
        },
    });

    const handlePaymentSuccess = useCallback(async () => {
        if (!sessionId) {
            return;
        }

        try {
            await fetchSession(sessionId);
        } catch {
            // Ignore
        }
    }, [sessionId, fetchSession]);

    useEffect(() => {
        if (!sessionId) {
            router.replace(siteConfig.pages.dashboard.link);
        }

        handlePaymentSuccess().catch(() => {
            // Ignore
        });
    }, [sessionId, handlePaymentSuccess, router]);

    return (
        <div className="flex h-screen items-center justify-center">
            <DotsLoader />
        </div>
    );
}
