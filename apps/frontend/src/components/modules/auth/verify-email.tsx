"use client";

import { Button } from "@itsrakesh/ui";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Icons } from "@/assets/icons";
import { ErrorBox } from "@/components/ui/error-box";
import { Heading } from "@/components/ui/heading";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";

interface VerifyEmailProps extends React.HTMLAttributes<HTMLDivElement> {}

export function VerifyEmail({ ...props }: VerifyEmailProps) {
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const { mutateAsync: verifyEmail } = trpc.verifyEmail.useMutation({
        onSuccess() {
            setError(null);
            setIsSuccess(true);
        },
        onError(error) {
            setError(error.message);
        },
    });

    const handleVerifyEmail = async () => {
        if (!token) {
            return;
        }

        try {
            await verifyEmail({ token });
        } catch (error) {}
    };

    useEffect(() => {
        if (!token) {
            return;
        }

        handleVerifyEmail();
    }, [token]);

    if (!token) {
        return (
            <div>
                <ErrorBox
                    title="Invalid URL"
                    description="Please check your email for correct URL."
                />
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <ErrorBox title="Error" description={error} />
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center space-y-6">
                <Heading level={2}>Account verified!</Heading>
                <p>
                    Congratulations! Your account has been verified. You can now login to your
                    account.
                </p>
                <Button asChild>
                    <Link href={siteConfig.pages.login.link}>Login</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center">
            <Icons.LoadingDot className="h-4 w-4 animate-bounce" />
            <Icons.LoadingDot className="h-4 w-4 animate-bounce delay-100" />
            <Icons.LoadingDot className="h-4 w-4 animate-bounce delay-200" />
        </div>
    );
}
