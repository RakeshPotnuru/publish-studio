"use client";

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
} from "@itsrakesh/ui";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Center } from "@/components/ui/center";
import { ErrorBox } from "@/components/ui/error-box";
import { Heading } from "@/components/ui/heading";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { Shake } from "@/components/ui/shake";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";
import { Captcha } from "./captcha";
import { ShowPassword } from "./show-password";

const emailFormSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
});

const passwordFormSchema = z
    .object({
        password: z
            .string()
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,./:;<=>?@[\\\]^_{|}~-])(.{8,})$/,
                {
                    message:
                        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character",
                },
            ),
        confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
    })
    .refine(data => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export function ResetPasswordForm() {
    const [step, setStep] = useState<"email" | "link" | "password" | "success">("email");
    const [error, setError] = useState<string | null>(null);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState<string | null>(null);
    const [isCaptchaCompleted, setIsCaptchaCompleted] = useState(false);
    const [isCaptchaVerificationLoading, setIsCaptchaVerificationLoading] = useState(false);

    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    /* ----------------------------- Email form ----------------------------- */
    const { mutateAsync: sendResetPasswordEmail, isLoading: isSendingResetPassword } =
        trpc.auth.email.sendResetPassword.useMutation({
            onSuccess() {
                setError(null);
                setStep("link");
            },
            onError(error) {
                setError(error.message);
            },
        });

    const emailForm = useForm<z.infer<typeof emailFormSchema>>({
        resolver: zodResolver(emailFormSchema),
        mode: "onBlur",
        defaultValues: {
            email: "",
        },
    });

    const onEmailSubmit = async (data: z.infer<typeof emailFormSchema>) => {
        if (!isCaptchaCompleted) {
            setError("Please complete the captcha");
            return;
        }

        try {
            setError(null);
            setEmail(data.email);
            await sendResetPasswordEmail(data);
        } catch (error) {}
    };

    const handleResend = async () => {
        if (!email) {
            return;
        }

        try {
            setError(null);
            await sendResetPasswordEmail({ email });
        } catch (error) {}
    };

    const isEmailStepLoading =
        isSendingResetPassword || emailForm.formState.isSubmitting || isCaptchaVerificationLoading;
    /* ----------------------------- Email form end ----------------------------- */

    /* ----------------------------- Password form ----------------------------- */
    const { mutateAsync: resetPassword, isLoading: isResettingPassword } =
        trpc.auth.resetPassword.useMutation({
            onSuccess() {
                setError(null);
                setStep("success");
            },
            onError(error) {
                setError(error.message);
            },
        });

    const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
        resolver: zodResolver(passwordFormSchema),
        mode: "onBlur",
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const onPasswordSubmit = async (data: z.infer<typeof passwordFormSchema>) => {
        if (!token) {
            return;
        }

        if (!isCaptchaCompleted) {
            setError("Please complete the captcha");
            return;
        }

        try {
            setError(null);
            await resetPassword({ token, password: data.password });
        } catch (error) {}
    };

    const isPasswordStepLoading =
        isResettingPassword || passwordForm.formState.isSubmitting || isCaptchaVerificationLoading;
    /* ----------------------------- Password form end ----------------------------- */

    useEffect(() => {
        if (!token) {
            return;
        }

        setStep("password");
    }, [token]);

    if (step === "password" && !token) {
        return (
            <div>
                <ErrorBox
                    title="Invalid URL"
                    description="Please check your email for correct URL."
                />
            </div>
        );
    }

    if (step === "success") {
        return (
            <div className="flex flex-col items-center space-y-6">
                <Heading level={2}>Password reset successful!</Heading>
                <p>
                    Your password has been reset successfully. You may now login to your account
                    with your new password.
                </p>
                <Button asChild>
                    <Link href={siteConfig.pages.login.link}>Login</Link>
                </Button>
            </div>
        );
    }

    return (
        <Shake isShaking={error}>
            <div className="space-y-6">
                <Heading level={2}>
                    {step === "email" || step === "password"
                        ? "Reset your password"
                        : "Password reset link sent!"}
                </Heading>
                {error && (
                    <Center>
                        <ErrorBox title="Error" description={error} />
                    </Center>
                )}
                <p className="text-sm">
                    {step === "email"
                        ? "Enter the email associated with your account and we'll email you a link to reset your password."
                        : step === "link" && (
                              <span>
                                  Check your inbox for a link to reset your password. If it
                                  doesn&apos;t appear within a few minutes, check your spam folder.
                                  If you still can&apos;t find it,{" "}
                                  <Button
                                      onClick={() => setStep("email")}
                                      variant="link"
                                      className="h-max p-0"
                                  >
                                      try a different email address
                                  </Button>{" "}
                                  or{" "}
                                  <Button
                                      onClick={handleResend}
                                      variant="link"
                                      className="h-max p-0"
                                      disabled={isSendingResetPassword}
                                  >
                                      <ButtonLoader isLoading={isSendingResetPassword}>
                                          resend
                                      </ButtonLoader>
                                  </Button>
                                  .
                              </span>
                          )}
                </p>
                {/* ----------------------------- Email form ----------------------------- */}
                {step === "email" && (
                    <Form {...emailForm}>
                        <form
                            onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                            className="space-y-8"
                        >
                            <FormField
                                control={emailForm.control}
                                name="email"
                                disabled={isEmailStepLoading}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="me@example.com"
                                                autoComplete="email"
                                                autoFocus
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
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
                                    !emailForm.formState.isDirty ||
                                    isEmailStepLoading ||
                                    !isCaptchaCompleted
                                }
                            >
                                <ButtonLoader isLoading={isSendingResetPassword}>
                                    Continue
                                </ButtonLoader>
                            </Button>
                        </form>
                    </Form>
                )}
                {/* ----------------------------- Email form end ----------------------------- */}

                {/* ----------------------------- Password form ----------------------------- */}
                {step === "password" && (
                    <Form {...passwordForm}>
                        <form
                            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                            className="space-y-8"
                        >
                            <FormField
                                control={passwordForm.control}
                                name="password"
                                disabled={isPasswordStepLoading}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type={passwordVisible ? "text" : "password"}
                                                placeholder="********"
                                                autoComplete="new-password"
                                                autoFocus
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
                            <FormField
                                control={passwordForm.control}
                                name="confirmPassword"
                                disabled={isPasswordStepLoading}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="********"
                                                autoComplete="new-password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
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
                                    !passwordForm.formState.isDirty ||
                                    isPasswordStepLoading ||
                                    !isCaptchaCompleted
                                }
                            >
                                <ButtonLoader isLoading={isResettingPassword}>
                                    Continue
                                </ButtonLoader>
                            </Button>
                        </form>
                    </Form>
                )}
                {/* ----------------------------- Password form end ----------------------------- */}
                <p className="text-center">
                    <Button variant="link" className="h-max p-0" asChild>
                        <Link href={siteConfig.pages.login.link}>Back to Login</Link>
                    </Button>
                </p>
                <p className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Button variant="link" className="h-max p-0" asChild>
                        <Link href={siteConfig.pages.register.link}>Register</Link>
                    </Button>
                </p>
            </div>
        </Shake>
    );
}
