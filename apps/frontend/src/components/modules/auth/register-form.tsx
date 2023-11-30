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
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Heading } from "@/components/ui/heading";
import { constants } from "@/config/constants";

interface RegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const formSchema = z
    .object({
        email: z.string().email({ message: "Please enter a valid email address" }),
        firstName: z
            .string()
            .min(1, { message: "Please enter your first name" })
            .max(
                constants.user.firstName.MAX_LENGTH,
                `First name must not exceed ${constants.user.firstName.MAX_LENGTH} characters`,
            ),
        lastName: z
            .string()
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
        confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
    })
    .refine(data => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export function RegisterForm({ ...props }: RegisterFormProps) {
    const [step, setStep] = useState<"register" | "success">("register");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onBlur",
        defaultValues: {
            email: "",
            firstName: "",
            lastName: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data);
    };

    return (
        <div {...props}>
            {step === "register" ? (
                <div className="space-y-6">
                    <Heading level={2}>Create an account to get started</Heading>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="me@example.com"
                                                autoComplete="email"
                                                disabled={form.formState.isSubmitting}
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
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="John"
                                                    autoComplete="given-name"
                                                    disabled={form.formState.isSubmitting}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Doe"
                                                    autoComplete="family-name"
                                                    disabled={form.formState.isSubmitting}
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
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="********"
                                                autoComplete="new-password"
                                                disabled={form.formState.isSubmitting}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="********"
                                                autoComplete="new-password"
                                                disabled={form.formState.isSubmitting}
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
                                disabled={form.formState.isSubmitting || !form.formState.isDirty}
                            >
                                Create Account
                            </Button>
                        </form>
                    </Form>
                    <p className="text-center text-sm">
                        Have an account?{" "}
                        <Button variant="link" className="h-max p-0" asChild>
                            <Link href="/login">Login</Link>
                        </Button>
                    </p>
                </div>
            ) : (
                <span>
                    <Heading level={2}>Verify your email</Heading>
                    <p>
                        Check your email for a link to verify your email. If it doesn&apos;t appear
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
