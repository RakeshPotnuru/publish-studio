import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { toast } from "@itsrakesh/ui";
import { useTheme } from "next-themes";

import { Center } from "@/components/ui/center";
import { ErrorBox } from "@/components/ui/error-box";
import { DotsLoader } from "@/components/ui/loaders/dots-loader";
import { Shake } from "@/components/ui/shake";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            use_fedcm_for_prompt: boolean;
            callback: (response: { credential: string }) => Promise<void>;
            auto_select: boolean;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              type: "standard";
              theme: "filled_black" | "filled_blue";
              size: "large";
              text: "continue_with";
              shape: "rectangular";
            },
          ) => void;
          prompt: () => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

export function GoogleAuth() {
  const [error, setError] = useState<string | null>(null);

  const redirectTo = useSearchParams().get("redirect_to");

  const { theme } = useTheme();
  const authButtonRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { mutateAsync: connectGoogle, isLoading } =
    trpc.auth.connectGoogle.useMutation({
      onSuccess({ data }) {
        toast.success(`Authenticated as ${data.user.email}`);

        router.replace(redirectTo ?? siteConfig.pages.dashboard.link);
      },
      onError(error) {
        setError(error.message);
      },
    });

  const handleConnectGoogle = useCallback(
    async (response: { credential: string }) => {
      if (!response.credential) {
        return;
      }

      try {
        await connectGoogle({ id_token: response.credential });
      } catch {
        // Ignore
      }
    },
    [connectGoogle],
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || !authButtonRef.current) {
        throw new Error(
          "NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set or button doesn't exists.",
        );
      }

      try {
        window.google?.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          use_fedcm_for_prompt: true,
          callback: handleConnectGoogle,
          auto_select: true,
        });
        window.google?.accounts.id.renderButton(authButtonRef.current, {
          type: "standard",
          theme: theme === "dark" ? "filled_black" : "filled_blue",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
        });
        window.google?.accounts.id.prompt();
      } catch (error) {
        // Ignore
        console.log(error);
      }
    }
  }, [theme, handleConnectGoogle]);

  return (
    <Shake isShaking={error} className="flex justify-center">
      {error && (
        <Center>
          <ErrorBox title="Error" description={error} />
        </Center>
      )}
      {isLoading ? <DotsLoader /> : <div ref={authButtonRef} />}
    </Shake>
  );
}
