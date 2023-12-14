import { zodResolver } from "@hookform/resolvers/zod";
import {
    Button,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
    Input,
    RadioGroup,
    RadioGroupItem,
    useToast,
} from "@itsrakesh/ui";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Icons } from "@/assets/icons";
import { ErrorBox } from "@/components/ui/error-box";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";
import { cn } from "@itsrakesh/utils";
import { useState } from "react";

interface DevEditFormProps extends React.HTMLAttributes<HTMLDivElement> {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    default_publish_status: string;
}

const formSchema = z.object({
    api_key: z.string().optional(),
    default_publish_status: z.string().optional(),
});

export function DevEditForm({
    default_publish_status,
    setIsOpen,
    ...props
}: Readonly<DevEditFormProps>) {
    const [error, setError] = useState<string | null>(null);

    const { toast } = useToast();
    const utils = trpc.useUtils();

    const { mutateAsync: edit, isLoading } = trpc.updateDevTo.useMutation({
        onSuccess: () => {
            toast({
                variant: "success",
                title: "Updated",
                description: "Your Dev account has been updated successfully.",
            });
            utils.getAllPlatforms.invalidate();
            setIsOpen(false);
        },
        onError: error => {
            setError(error.message);
        },
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            api_key: "",
            default_publish_status,
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setError(null);
            await edit({
                api_key: data.api_key,
                default_publish_status: data.default_publish_status === "true",
            });
        } catch (error) {}
    };

    return (
        <div
            className={cn("space-y-2", {
                "animate-shake": error,
            })}
            {...props}
        >
            {error && <ErrorBox title="Could not connect Dev" description={error} />}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="api_key"
                        disabled={form.formState.isSubmitting || isLoading}
                        render={({ field }) => (
                            <FormItem>
                                <div className="space-y-1">
                                    <FormLabel className="flex flex-row space-x-1">
                                        <span>API key</span>{" "}
                                        <HoverCard>
                                            <HoverCardTrigger asChild>
                                                <Button
                                                    variant="link"
                                                    className="text-foreground h-max p-0"
                                                >
                                                    <Icons.Question />
                                                </Button>
                                            </HoverCardTrigger>
                                            <HoverCardContent className="w-44" side="right">
                                                <Button
                                                    type="button"
                                                    variant="link"
                                                    className="h-max p-0"
                                                    asChild
                                                >
                                                    <Link
                                                        href={siteConfig.links.devAPIKeyGuide}
                                                        target="_blank"
                                                    >
                                                        Learn
                                                    </Link>
                                                </Button>{" "}
                                                how to get your API key.
                                            </HoverCardContent>
                                        </HoverCard>
                                    </FormLabel>
                                    <p className="text-muted-foreground text-xs">
                                        Your API key will be encrypted and stored securely.{" "}
                                        <Button
                                            type="button"
                                            variant="link"
                                            size="sm"
                                            className="h-max p-0"
                                            asChild
                                        >
                                            <Link
                                                href={siteConfig.links.apiKeysSecureStorage}
                                                target="_blank"
                                            >
                                                Learn more
                                            </Link>
                                        </Button>
                                    </p>
                                </div>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="API key"
                                        disabled={form.formState.isSubmitting}
                                        autoComplete="off"
                                        autoFocus
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="default_publish_status"
                        disabled={form.formState.isSubmitting || isLoading}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Update publish status for Dev</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-row space-x-2"
                                    >
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="false" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Draft</FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="true" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Publish</FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        disabled={form.formState.isSubmitting || !form.formState.isDirty}
                        className="w-full"
                    >
                        {isLoading ? (
                            <>
                                <Icons.Loading className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </>
                        ) : (
                            "Update"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
