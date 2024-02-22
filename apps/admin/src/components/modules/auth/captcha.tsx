import { Turnstile } from "@marsidev/react-turnstile";
import { useTheme } from "next-themes";

import { trpc } from "@/utils/trpc";

interface CaptchaProps {
  setIsSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Captcha = ({
  setIsSuccess,
  setErrorMessage,
  setIsLoading,
}: CaptchaProps) => {
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
    } catch {
      // Ignore
    }
  };

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!siteKey) {
    throw new Error("NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set");
  }

  return (
    <Turnstile
      siteKey={siteKey}
      onSuccess={handleVerify}
      options={{
        theme: theme === "dark" ? "dark" : "light",
      }}
    />
  );
};
