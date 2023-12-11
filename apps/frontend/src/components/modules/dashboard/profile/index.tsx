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
    useToast,
} from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Icons } from "@/assets/icons";
import { ErrorBox } from "@/components/ui/error-box";
import { Heading } from "@/components/ui/heading";
import { Tooltip } from "@/components/ui/tooltip";
import { constants } from "@/config/constants";
import useUserStore from "@/lib/store/user";
import { trpc } from "@/utils/trpc";

interface ProfileProps extends React.HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
    first_name: z
        .string()
        .regex(/^((?!\p{Extended_Pictographic}).)*$/u, "Emojis are not allowed")
        .min(1, "First Name cannot be empty")
        .max(constants.user.firstName.MAX_LENGTH)
        .optional(),
    last_name: z
        .string()
        .regex(/^((?!\p{Extended_Pictographic}).)*$/u, "Emojis are not allowed")
        .min(1, "Last Name cannot be empty")
        .max(constants.user.lastName.MAX_LENGTH)
        .optional(),
    // email: z.string().min(1, "Email cannot be empty").email().optional(),
});

export function Profile({ ...props }: ProfileProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { user, isLoading } = useUserStore();
    const utils = trpc.useUtils();
    const { toast } = useToast();

    const { mutateAsync: editProfile, isLoading: isUpdating } = trpc.updateUser.useMutation({
        onSuccess: () => {
            toast({
                variant: "success",
                title: "Profile Updated",
                description: "Your profile has been updated successfully.",
            });
            setIsEditing(false);
            utils.getUser.invalidate();
        },
        onError: error => {
            setError(error.message);
        },
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        mode: "onBlur",
        defaultValues: {
            first_name: isLoading ? "Loading..." : "",
            last_name: isLoading ? "Loading..." : "",
            email: isLoading ? "Loading..." : "",
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            await editProfile(data);
        } catch (error) {}
    };

    useEffect(() => {
        if (user) {
            form.reset({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
            });
        }
    }, [user, form]);

    return (
        <div
            className={cn({
                "animate-shake": error,
            })}
            {...props}
        >
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
                                        form.formState.isSubmitting ||
                                        !form.formState.isDirty ||
                                        isUpdating
                                    }
                                >
                                    {isUpdating ? (
                                        <>
                                            <Icons.Loading className="mr-2 h-4 w-4 animate-spin" />
                                            Please wait
                                        </>
                                    ) : (
                                        "Save"
                                    )}
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
                    {error && <ErrorBox title="Update failed" description={error} />}
                    <div className="space-y-8">
                        <FormField
                            control={form.control}
                            name="email"
                            disabled
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
                                name="first_name"
                                disabled={!isEditing || isLoading || isUpdating}
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
                                disabled={!isEditing || isLoading || isUpdating}
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
