import { useToast } from "@itsrakesh/ui";
import { useCallback, useEffect, useRef, useState } from "react";

import { DotsLoader } from "@/components/ui/dots-loader";
import { ErrorBox } from "@/components/ui/error-box";
import { trpc } from "@/utils/trpc";
import { useTheme } from "next-themes";

export function GoogleAuth() {
    const [error, setError] = useState<string | null>(null);

    const { toast } = useToast();
    const { theme } = useTheme();
    const authButtonRef = useRef<HTMLDivElement>(null);

    const { mutateAsync: connectGoogle, isLoading } = trpc.connectGoogle.useMutation({
        onSuccess({ data }) {
            toast({
                variant: "success",
                description: `Authenticated as ${data.user.email}`,
            });

            if (!data.access_token) {
                return;
            }

            localStorage.setItem("ps_access_token", data.access_token);

            setTimeout(() => {
                window.location.reload();
            }, 1000);
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
            } catch (error) {}
        },
        [connectGoogle],
    );

    useEffect(() => {
        if (typeof window !== "undefined") {
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
            } catch (error) {}
        }
    }, [theme, handleConnectGoogle]);

    return (
        <div className="flex justify-center">
            {error && <ErrorBox title="Error" description={error} />}
            {isLoading ? (
                <DotsLoader />
            ) : (
                <div
                    ref={authButtonRef}
                    style={{
                        colorScheme: "auto",
                        boxShadow: "0 2px 4px 0 rgba(0,0,0,0.25)",
                        borderRadius: "4px",
                    }}
                />
            )}
        </div>
    );
}
