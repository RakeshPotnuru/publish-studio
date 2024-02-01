"use client";

import { useState } from "react";
import Link from "next/link";

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
import { constants } from "@publish-studio/core/src/config/constants";
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
import { GoogleAuth } from "./google-auth";
import { ShowPassword } from "./show-password";

const formSchema = z
    .object({
        email: z.string().email({ message: "Please enter a valid email address" }),
        first_name: z
            .string()
            .regex(/^((?!\p{Extended_Pictographic}).)*$/u, "Emojis are not allowed")
            .min(1, { message: "Please enter your first name" })
            .max(
                constants.user.firstName.MAX_LENGTH,
                `First name must not exceed ${constants.user.firstName.MAX_LENGTH} characters`,
            ),
        last_name: z
            .string()
            .regex(/^((?!\p{Extended_Pictographic}).)*$/u, "Emojis are not allowed")
            .min(1, { message: "Please enter your last name" })
            .max(
                constants.user.lastName.MAX_LENGTH,
                `Last name must not exceed ${constants.user.firstName.MAX_LENGTH} characters`,
            ),
        password: z
            .string()
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,./:;<=>?@[\\\]^_{|}~-])(.{8,})$/,
                {
                    message:
                        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character",
                },
            ),
        confirm_password: z.string().min(1, { message: "Please confirm your password" }),
    })
    .refine(data => data.password === data.confirm_password, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export function RegisterForm() {
    const [step, setStep] = useState<"register" | "success">("register");
    const [error, setError] = useState<string | null>(null);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isCaptchaCompleted, setIsCaptchaCompleted] = useState(false);
    const [isCaptchaVerificationLoading, setIsCaptchaVerificationLoading] = useState(false);

    const { mutateAsync: register, isLoading: isRegistering } = trpc.auth.register.useMutation({
        onSuccess() {
            setStep("success");
        },
        onError(error) {
            setError(error.message);
        },
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onBlur",
        defaultValues: {
            email: "",
            first_name: "",
            last_name: "",
            password: "",
            confirm_password: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (!isCaptchaCompleted) {
            setError("Please complete the captcha");
            return;
        }

        try {
            setError(null);
            await register(data);
        } catch {
            // Ignore
        }
    };

    const isLoading = isRegistering || form.formState.isSubmitting || isCaptchaVerificationLoading;

    return (
        <Shake isShaking={error}>
            {step === "register" ? (
                <div className="space-y-6">
                    <Heading level={2}>Create an account to get started</Heading>
                    {error && (
                        <Center>
                            <ErrorBox title="Registration failed" description={error} />
                        </Center>
                    )}
                    <GoogleAuth />
                    <p className="text-center">Or</p>
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
                            <div className="grid grid-cols-2 gap-2">
                                <FormField
                                    control={form.control}
                                    name="first_name"
                                    disabled={isLoading}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="John"
                                                    autoComplete="given-name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="last_name"
                                    disabled={isLoading}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Doe"
                                                    autoComplete="family-name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="password"
                                disabled={isLoading}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type={passwordVisible ? "text" : "password"}
                                                placeholder="********"
                                                autoComplete="new-password"
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
                                control={form.control}
                                name="confirm_password"
                                disabled={isLoading}
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
                                    !form.formState.isDirty || isLoading || !isCaptchaCompleted
                                }
                            >
                                <ButtonLoader isLoading={isRegistering}>
                                    Create Account
                                </ButtonLoader>
                            </Button>
                        </form>
                    </Form>
                    <p className="text-center text-sm">
                        Have an account?{" "}
                        <Button variant="link" className="h-max p-0" asChild>
                            <Link href={siteConfig.pages.login.link}>Login</Link>
                        </Button>
                    </p>
                </div>
            ) : (
                <span className="space-y-6">
                    <Heading level={2}>Verify your email</Heading>
                    <p>
                        Check your inbox for a link to verify your email. If it doesn&apos;t appear
                        within a few minutes, check your spam folder. If you still can&apos;t find
                        it,
                    </p>{" "}
                    <Button
                        variant="link"
                        className="h-max p-0"
                        onClick={() => setStep("register")}
                    >
                        try a different email address
                    </Button>{" "}
                    or{" "}
                    <Button variant="link" className="h-max p-0">
                        resend
                    </Button>
                    .
                </span>
            )}
        </Shake>
    );
}
