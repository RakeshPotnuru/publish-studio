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
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Heading } from "@/components/ui/heading";

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

    const onEmailSubmit = (data: z.infer<typeof emailFormSchema>) => {
        console.log(data);
    };

    const onPasswordSubmit = (data: z.infer<typeof passwordFormSchema>) => {
        console.log(data);
    };

    return (
        <div {...props}>
            <div className="space-y-6">
                <Heading level={2}>
                    {step === "email" || step === "password"
                        ? "Reset your password"
                        : "Password reset link sent!"}
                </Heading>
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
                {/* Email form */}
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
                                                disabled={emailForm.formState.isSubmitting}
                                                autoFocus
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
                                    emailForm.formState.isSubmitting || !emailForm.formState.isDirty
                                }
                            >
                                Continue
                            </Button>
                        </form>
                    </Form>
                )}
                {/* Password form */}
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
                                                disabled={passwordForm.formState.isSubmitting}
                                                autoFocus
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
                                                disabled={passwordForm.formState.isSubmitting}
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
                                    passwordForm.formState.isSubmitting ||
                                    !passwordForm.formState.isDirty
                                }
                            >
                                Continue
                            </Button>
                        </form>
                    </Form>
                )}
                <p className="text-center">
                    <Button variant="link" className="h-max p-0" asChild>
                        <Link href="/login">Back to Login</Link>
                    </Button>
                </p>
                <p className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Button variant="link" className="h-max p-0" asChild>
                        <Link href="/register">Register</Link>
                    </Button>
                </p>
            </div>
        </div>
    );
}
