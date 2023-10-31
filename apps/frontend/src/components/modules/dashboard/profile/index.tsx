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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Icons } from "@/assets/icons";
import { Heading } from "@/components/ui/heading";
import { Tooltip } from "@/components/ui/tooltip";

interface ProfileProps extends React.HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
    firstName: z.string().nonempty("First Name cannot be empty").optional(),
    lastName: z.string().nonempty("Last Name cannot be empty").optional(),
    email: z.string().nonempty("Email cannot be empty").email().optional(),
});

export function Profile({ ...props }: ProfileProps) {
    const [editMode, setEditMode] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        mode: "onBlur",
        defaultValues: {
            firstName: "Rakesh",
            lastName: "Potnuru",
            email: "rakesh@itsrakesh.com",
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data);
    };

    return (
        <div className="" {...props}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex flex-row justify-between">
                        <Heading>Profile</Heading>
                        {editMode ? (
                            <div className="flex flex-row space-x-4">
                                <Button variant="outline" onClick={() => setEditMode(false)}>
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
                                    onClick={() => setEditMode(true)}
                                    variant="ghost"
                                    size="icon"
                                >
                                    <Icons.editprofile size={25} />
                                </Button>
                            </Tooltip>
                        )}
                    </div>
                    <Separator />
                    <div className="space-y-8">
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
                                            disabled={!editMode}
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
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="John"
                                                autoComplete="given-name"
                                                disabled={!editMode}
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
                                                disabled={!editMode}
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
