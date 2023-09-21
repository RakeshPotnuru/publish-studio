"use client";

import { Button, Input, Label } from "@itsrakesh/ui";
import Link from "next/link";
import React from "react";

interface RegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function RegisterForm({ ...props }: RegisterFormProps) {
    return (
        <div
            className="bg-background dark:bg-background-dark mx-auto flex w-full flex-col justify-center space-y-6 rounded-lg p-14 shadow-xl sm:w-[500px]"
            {...props}
        >
            <div className="space-y-6">
                <h1 className="text-2xl font-semibold">Create an account to get started</h1>
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
                        <div className="flex flex-row space-x-2">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    type="text"
                                    id="firstName"
                                    placeholder="John"
                                    autoComplete="given-name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    type="text"
                                    id="lastName"
                                    placeholder="Doe"
                                    autoComplete="family-name"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                type="password"
                                id="password"
                                placeholder="********"
                                autoComplete="new-password"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                type="password"
                                id="confirmPassword"
                                placeholder="********"
                                autoComplete="new-password"
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Create Account
                        </Button>
                    </div>
                </form>
                <p className="text-center">
                    Have an account?{" "}
                    <Link href="/login">
                        <Button variant="link" className="h-max p-0">
                            Login
                        </Button>
                    </Link>
                </p>
            </div>
        </div>
    );
}
