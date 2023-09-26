"use client";

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
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface ResetPasswordFormProps extends React.HTMLAttributes<HTMLDivElement> {}

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
        confirmPassword: z.string().nonempty({ message: "Please confirm your password" }),
    })
    .refine(data => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export function ResetPasswordForm({ ...props }: ResetPasswordFormProps) {
    const [step, setStep] = React.useState<"email" | "success" | "password">("email");

    const emailForm = useForm<z.infer<typeof emailFormSchema>>({
        resolver: zodResolver(emailFormSchema),
        mode: "onBlur",
        defaultValues: {
            email: "",
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

    function onEmailSubmit(data: z.infer<typeof emailFormSchema>) {
        console.log(data);
    }

    function onPasswordSubmit(data: z.infer<typeof passwordFormSchema>) {
        console.log(data);
    }

    return (
        <div {...props}>
            <div className="space-y-6">
                <h1 className="text-2xl font-semibold">
                    {step === "email" || step === "password"
                        ? "Reset your password"
                        : "Password reset link sent!"}
                </h1>
                <p className="text-sm">
                    {step === "email" ? (
                        "Enter the email associated with your account and we'll email you a link to reset your password."
                    ) : (
                        <>
                            {step === "success" && (
                                <span>
                                    Check your email for a link to reset your password. If it
                                    doesn&apos;t appear within a few minutes, check your spam
                                    folder. If you still can&apos;t find it,{" "}
                                    <Button
                                        variant="link"
                                        className="h-max p-0"
                                        onClick={() => setStep("email")}
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
                        </>
                    )}
                </p>
                {step === "email" && (
                    <Form {...emailForm}>
                        <form
                            onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                            className="space-y-8"
                        >
                            <FormField
                                control={emailForm.control}
                                name="email"
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
                            <Button type="submit" className="w-full">
                                Continue
                            </Button>
                        </form>
                    </Form>
                )}
                {step === "password" && (
                    <Form {...passwordForm}>
                        <form
                            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                            className="space-y-8"
                        >
                            <FormField
                                control={passwordForm.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
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
                            <FormField
                                control={passwordForm.control}
                                name="confirmPassword"
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
                            <Button type="submit" className="w-full">
                                Continue
                            </Button>
                        </form>
                    </Form>
                )}
                <p className="text-center">
                    <Link href="/login">
                        <Button variant="link" className="h-max p-0">
                            Back to Login
                        </Button>
                    </Link>
                </p>
                <p className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/register">
                        <Button variant="link" className="h-max p-0">
                            Register
                        </Button>
                    </Link>
                </p>
            </div>
        </div>
    );
}
