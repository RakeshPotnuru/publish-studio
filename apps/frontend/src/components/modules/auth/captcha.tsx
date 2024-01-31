import { forwardRef } from "react";
import Link from "next/link";

import HCaptcha from "@hcaptcha/react-hcaptcha";
import { Button } from "@itsrakesh/ui";
import { useTheme } from "next-themes";

import { trpc } from "@/utils/trpc";

interface CaptchaProps {
    setIsSuccess: React.Dispatch<React.SetStateAction<boolean>>;
    setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Captcha = forwardRef<HCaptcha, CaptchaProps>(
    ({ setIsSuccess, setErrorMessage, setIsLoading }, ref) => {
        const { theme } = useTheme();

        const { mutateAsync: verify } = trpc.auth.verifyCaptcha.useMutation({
            onSuccess({ status }) {
                if (status === "success") {
                    setIsSuccess(true);
                }
                setIsLoading(false);
            },
            onError(error) {
                setErrorMessage(error.message);
                setIsSuccess(false);
                setIsLoading(false);
            },
        });

        const handleVerify = async (token: string) => {
            try {
                setIsLoading(true);
                await verify(token);
            } catch {}
        };

        if (!process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY) {
            return null;
        }

        return (
            <HCaptcha
                ref={ref}
                sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY}
                onVerify={handleVerify}
                theme={theme === "dark" ? "dark" : "light"}
            />
        );
    },
);
Captcha.displayName = "Captcha";

export function HCaptchaDisclosure() {
    return (
        <div className="rounded-lg border p-2">
            <p className="text-center text-xs">
                This site is protected by hCaptcha and its{" "}
                <Button variant="link" size="sm" className="h-max p-0">
                    <Link href="https://www.hcaptcha.com/privacy" target="_blank">
                        Privacy Policy
                    </Link>
                </Button>{" "}
                and{" "}
                <Button variant="link" size="sm" className="h-max p-0">
                    <Link href="https://www.hcaptcha.com/terms" target="_blank">
                        Terms of Service
                    </Link>
                </Button>{" "}
                apply.
            </p>
        </div>
    );
}
