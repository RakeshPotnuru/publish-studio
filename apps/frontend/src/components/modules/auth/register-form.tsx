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
import { cn } from "@itsrakesh/utils";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ErrorBox } from "@/components/ui/error-box";
import { Heading } from "@/components/ui/heading";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { constants } from "@/config/constants";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";
import { GoogleAuth } from "./google-auth";
import { ShowPassword } from "./show-password";

interface RegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {}

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

export function RegisterForm({ ...props }: RegisterFormProps) {
    const [step, setStep] = useState<"register" | "success">("register");
    const [error, setError] = useState<string | null>(null);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const { mutateAsync: register, isLoading } = trpc.register.useMutation({
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
        try {
            setError(null);
            await register(data);
        } catch (error) {}
    };

    return (
        <div
            className={cn({
                "animate-shake": error,
            })}
            {...props}
        >
            {step === "register" ? (
                <div className="space-y-6">
                    <Heading level={2}>Create an account to get started</Heading>
                    {error && <ErrorBox title="Registration failed" description={error} />}
                    <GoogleAuth />
                    <p className="text-center">Or</p>
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
                            <div className="grid grid-cols-2 gap-2">
                                <FormField
                                    control={form.control}
                                    name="first_name"
                                    disabled={form.formState.isSubmitting || isLoading}
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
                                    disabled={form.formState.isSubmitting || isLoading}
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
                                disabled={form.formState.isSubmitting || isLoading}
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
                                disabled={form.formState.isSubmitting || isLoading}
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
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={
                                    form.formState.isSubmitting ||
                                    !form.formState.isDirty ||
                                    isLoading
                                }
                            >
                                <ButtonLoader isLoading={isLoading}>Create Account</ButtonLoader>
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
        </div>
    );
}
