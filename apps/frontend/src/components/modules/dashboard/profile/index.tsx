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
    Separator,
} from "@itsrakesh/ui";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Icons } from "@/assets/icons";
import { Heading } from "@/components/ui/heading";
import { Tooltip } from "@/components/ui/tooltip";
import useUserStore from "@/lib/store/user-store";

interface ProfileProps extends React.HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
    firstName: z.string().min(1, "First Name cannot be empty").optional(),
    lastName: z.string().min(1, "Last Name cannot be empty").optional(),
    email: z.string().min(1, "Email cannot be empty").email().optional(),
});

export function Profile({ ...props }: ProfileProps) {
    const [isEditing, setIsEditing] = useState(false);

    const { user } = useUserStore();

    const form = useForm({
        resolver: zodResolver(formSchema),
        mode: "onBlur",
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data);
    };

    useEffect(() => {
        if (user) {
            form.reset({
                firstName: user?.first_name,
                lastName: user?.last_name,
                email: user?.email,
            });
        }
    }, [user, form]);

    return (
        <div {...props}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex flex-row justify-between">
                        <Heading>Profile</Heading>
                        {isEditing ? (
                            <div className="flex flex-row space-x-4">
                                <Button variant="outline" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={
                                        form.formState.isSubmitting || !form.formState.isDirty
                                    }
                                >
                                    Save
                                </Button>
                            </div>
                        ) : (
                            <Tooltip content="Edit Profile">
                                <Button
                                    onClick={() => setIsEditing(true)}
                                    variant="ghost"
                                    size="icon"
                                >
                                    <Icons.EditProfile size={25} />
                                </Button>
                            </Tooltip>
                        )}
                    </div>
                    <Separator />
                    <div className="space-y-8">
                        <FormField
                            control={form.control}
                            name="email"
                            disabled={!isEditing}
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
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="firstName"
                                disabled={!isEditing}
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
                                name="lastName"
                                disabled={!isEditing}
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
                    </div>
                </form>
            </Form>
        </div>
    );
}
