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
    toast,
} from "@itsrakesh/ui";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Center } from "@/components/ui/center";
import { ErrorBox } from "@/components/ui/error-box";
import { Heading } from "@/components/ui/heading";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { Shake } from "@/components/ui/shake";
import { constants } from "@/config/constants";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";
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

    const [_, setCookie] = useCookies(["ps_access_token"]);

    const { mutateAsync: login, isLoading: isLoggingIn } = trpc.auth.login.useMutation({
        onSuccess({ data }) {
            if (!data.access_token) {
                setError("Something went wrong. Please try again.");
                return;
            }

            const decoded = jwtDecode<{ exp: number }>(data.access_token);
            setCookie("ps_access_token", data.access_token, {
                path: "/",
                expires: new Date(decoded.exp * 1000),
                sameSite: "lax",
            });

            toast.success("Logged in successfully", {
                description: `Welcome back, ${data.user.first_name} ${data.user.last_name}!`,
            });

            setTimeout(() => {
                window.location.href = siteConfig.pages.dashboard.link;
            }, 1000);
        },
        onError(error) {
            if (error.message === constants.errorCauses.VERIFICATION_PENDING) {
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
        try {
            setError(null);
            setEmail(data.email);
            await login(data);
        } catch (error) {}
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
        } catch (error) {}
    };

    const isLoading = form.formState.isSubmitting || isLoggingIn || isResendLoading;

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
                    <div className="flex justify-center">
                        <Button
                            onClick={handleResendVerificationEmail}
                            variant="ghost"
                            disabled={isLoading}
                        >
                            <ButtonLoader isLoading={isResendLoading}>
                                Resend verification email
                            </ButtonLoader>
                        </Button>
                    </div>
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
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={!form.formState.isDirty || isLoading}
                        >
                            <ButtonLoader isLoading={isLoggingIn}>Continue</ButtonLoader>
                        </Button>
                    </form>
                </Form>
                <p className="text-center">Or</p>
                <GoogleAuth />
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
