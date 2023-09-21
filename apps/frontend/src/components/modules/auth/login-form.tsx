"use client";

import { Button, Input, Label } from "@itsrakesh/ui";
import Link from "next/link";
import React from "react";

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function LoginForm({ ...props }: LoginFormProps) {
    return (
        <div
            className="bg-background dark:bg-background-dark mx-auto flex w-full flex-col justify-center space-y-6 rounded-lg p-14 shadow-xl sm:w-[500px]"
            {...props}
        >
            <div className="space-y-6">
                <h1 className="text-2xl font-semibold">Sign in to your account</h1>
                <form>
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="email"
                                id="email"
                                placeholder="me@example.com"
                                autoComplete="email"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Button variant="link" className="h-max p-0">
                                    Forgot Password?
                                </Button>
                            </div>
                            <Input
                                type="password"
                                id="password"
                                placeholder="********"
                                autoComplete="current-password"
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Continue
                        </Button>
                    </div>
                </form>
                <p className="text-center">
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
