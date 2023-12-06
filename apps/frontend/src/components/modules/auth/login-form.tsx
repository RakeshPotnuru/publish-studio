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
    useToast,
} from "@itsrakesh/ui";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";

import { Icons } from "@/assets/icons";
import { ErrorBox } from "@/components/ui/error-box";
import { Heading } from "@/components/ui/heading";
import { constants } from "@/config/constants";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";
import { GoogleAuth } from "./google-auth";
import { ShowPassword } from "./show-password";

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(1, { message: "Please enter your password" }),
});

export function LoginForm({ ...props }: LoginFormProps) {
    const [error, setError] = useState<string | null>(null);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isVerificationError, setIsVerificationError] = useState(false);

    const [_, setCookie] = useCookies(["ps_access_token"]);

    const { toast } = useToast();

    const { mutateAsync: login, isLoading } = trpc.login.useMutation({
        onSuccess({ data }) {
            toast({
                variant: "success",
                title: "Logged in successfully",
                description: `Welcome back, ${data.user.first_name} ${data.user.last_name}!`,
            });

            if (!data.access_token) {
                setError("Something went wrong. Please try again.");
                return;
            }

            const decoded = jwtDecode<{ exp: number }>(data.access_token);
            setCookie("ps_access_token", data.access_token, {
                path: "/",
                expires: new Date(decoded.exp * 1000),
                sameSite: true,
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
            await login(data);
        } catch (error) {}
    };

    return (
        <div {...props}>
            <div className="space-y-6">
                <Heading level={2}>Sign in to your account</Heading>
                {error && <ErrorBox title="Login failed" description={error} />}
                {isVerificationError && (
                    <div className="flex justify-center">
                        <Button variant="ghost">Resend verification email</Button>
                    </div>
                )}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="email"
                            disabled={form.formState.isSubmitting || isLoading}
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
                            disabled={form.formState.isSubmitting || isLoading}
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex justify-between">
                                        <FormLabel>Password</FormLabel>
                                        <Button variant="link" className="h-max p-0" asChild>
                                            <Link href="/reset-password">Forgot Password?</Link>
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
                            disabled={
                                form.formState.isSubmitting || !form.formState.isDirty || isLoading
                            }
                        >
                            {isLoading ? (
                                <>
                                    <Icons.Loading className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </>
                            ) : (
                                "Continue"
                            )}
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
        </div>
    );
}
