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

import { Icons } from "@/assets/icons";
import { ErrorBox } from "@/components/ui/error-box";
import { Heading } from "@/components/ui/heading";
import { trpc } from "@/utils/trpc";

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(1, { message: "Please enter your password" }),
});

export function LoginForm({ ...props }: LoginFormProps) {
    const [error, setError] = useState<string | null>(null);

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

            localStorage.setItem("ps_access_token", data.access_token);

            setTimeout(() => {
                window.location.reload();
            }, 1000);
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
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {error && <ErrorBox title="Login failed" description={error} />}
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
                                            disabled={form.formState.isSubmitting || isLoading}
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
                                            type="password"
                                            placeholder="********"
                                            autoComplete="current-password"
                                            disabled={form.formState.isSubmitting || isLoading}
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
