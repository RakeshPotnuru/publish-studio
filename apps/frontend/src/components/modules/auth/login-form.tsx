"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  toast,
} from "@itsrakesh/ui";
import { ErrorCause } from "@publish-studio/core/src/config/constants";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Center } from "@/components/ui/center";
import { ErrorBox } from "@/components/ui/error-box";
import { Heading } from "@/components/ui/heading";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { Shake } from "@/components/ui/shake";
import { siteConfig } from "@/config/site";
import { useCoolDown } from "@/hooks/use-cool-down";
import { trpc } from "@/utils/trpc";

import { Captcha } from "./captcha";
import { GoogleAuth } from "./google-auth";
import { ShowPassword } from "./show-password";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Please enter your password" }),
});

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isVerificationError, setIsVerificationError] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [isCaptchaCompleted, setIsCaptchaCompleted] = useState(false);
  const [isCaptchaVerificationLoading, setIsCaptchaVerificationLoading] =
    useState(false);

  const { coolDown, setCoolDown } = useCoolDown();
  const redirectTo = useSearchParams().get("redirect_to");
  const router = useRouter();

  const { mutateAsync: login, isLoading: isLoggingIn } =
    trpc.auth.login.useMutation({
      onSuccess: ({ data }) => {
        toast.success("Logged in successfully", {
          description: `Welcome back, ${data.user.first_name} ${data.user.last_name}!`,
        });

        router.replace(redirectTo ?? siteConfig.pages.dashboard.link);
      },
      onError: (error) => {
        if (error.message === ErrorCause.VERIFICATION_PENDING.toString()) {
          setError(
            "Please verify your email address to continue. Check your inbox for the verification email.",
          );
          setIsVerificationError(true);
          return;
        }
        setIsVerificationError(false);
        setError(error.message);
      },
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!isCaptchaCompleted) {
      setError("Please complete the captcha");
      return;
    }

    try {
      setError(null);
      setEmail(data.email);
      await login(data);
    } catch {
      // Ignore
    }
  };

  const { mutateAsync: resendVerificationEmail, isLoading: isResendLoading } =
    trpc.auth.email.resendVerification.useMutation({
      onSuccess() {
        toast.success("Verification email sent successfully");
      },
      onError(error) {
        setError(error.message);
      },
    });

  const handleResendVerificationEmail = async () => {
    if (!email) {
      return;
    }

    try {
      setError(null);

      await resendVerificationEmail({ email });

      setCoolDown(60);
    } catch {
      // Ignore
    }
  };

  const isLoading =
    form.formState.isSubmitting ||
    isLoggingIn ||
    isResendLoading ||
    isCaptchaVerificationLoading;

  // const redirectLink = redirectTo ? `?redirect_to=${redirectTo}` : "";

  return (
    <Shake isShaking={error}>
      <div className="space-y-6">
        <Heading level={2}>Sign in to your account</Heading>
        {error && (
          <Center>
            <ErrorBox title="Login failed" description={error} />
          </Center>
        )}
        {isVerificationError && (
          <Center>
            <Button
              onClick={handleResendVerificationEmail}
              variant="ghost"
              disabled={isLoading || coolDown > 0}
            >
              <ButtonLoader isLoading={isResendLoading}>
                {coolDown > 0
                  ? `Resend verification email in ${coolDown}s`
                  : "Resend verification email"}
              </ButtonLoader>
            </Button>
          </Center>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="me@example.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between">
                    <FormLabel>Password</FormLabel>
                    <Button variant="link" className="h-max p-0" asChild>
                      <Link href={siteConfig.pages.resetPassword.link}>
                        Forgot Password?
                      </Link>
                    </Button>
                  </div>
                  <FormControl>
                    <Input
                      type={passwordVisible ? "text" : "password"}
                      placeholder="********"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <ShowPassword
                    passwordVisible={passwordVisible}
                    setPasswordVisible={setPasswordVisible}
                  />
                </FormItem>
              )}
            />
            <Center>
              <Captcha
                setIsSuccess={setIsCaptchaCompleted}
                setErrorMessage={setError}
                setIsLoading={setIsCaptchaVerificationLoading}
              />
            </Center>
            <Button
              type="submit"
              className="w-full"
              disabled={
                !form.formState.isDirty || isLoading || !isCaptchaCompleted
              }
            >
              <ButtonLoader isLoading={isLoggingIn}>Continue</ButtonLoader>
            </Button>
          </form>
        </Form>
        <p className="text-center">Or</p>
        <GoogleAuth />
        {/* <p className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Button variant="link" className="h-max p-0" asChild>
            <Link href={`${siteConfig.pages.register.link}${redirectLink}`}>
              Register
            </Link>
          </Button>
        </p> */}
      </div>
    </Shake>
  );
}
