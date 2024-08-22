"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button } from "@itsrakesh/ui";

import { Center } from "@/components/ui/center";
import { ErrorBox } from "@/components/ui/error-box";
import { Heading } from "@/components/ui/heading";
import { DotsLoader } from "@/components/ui/loaders/dots-loader";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";

export function VerifyEmail() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { mutateAsync: verifyEmail } = trpc.auth.email.verify.useMutation({
    onSuccess() {
      setError(null);
      setIsSuccess(true);
    },
    onError(error) {
      setError(error.message);
    },
  });

  const handleVerifyEmail = useCallback(async () => {
    if (!token) {
      return;
    }

    try {
      setError(null);
      await verifyEmail({ token });
    } catch {
      // Ignore
    }
  }, [token, verifyEmail]);

  useEffect(() => {
    if (!token) {
      return;
    }

    handleVerifyEmail().catch(() => {
      // Ignore
    });
  }, [token, handleVerifyEmail]);

  if (!token) {
    return (
      <Center>
        <ErrorBox
          title="Invalid URL"
          description="Please check your email for correct URL."
        />
      </Center>
    );
  }

  if (error) {
    return (
      <Center>
        <ErrorBox title="Error" description={error} />
      </Center>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center space-y-6">
        <Heading level={2}>Account verified!</Heading>
        <p>
          Congratulations! Your account has been verified. You can now login to
          your account and start your free trial.
        </p>
        <Button asChild>
          <Link href={siteConfig.pages.login.link}>Login</Link>
        </Button>
      </div>
    );
  }

  return <DotsLoader />;
}
