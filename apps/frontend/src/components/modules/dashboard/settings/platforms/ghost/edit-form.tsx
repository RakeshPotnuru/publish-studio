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
import { cn } from "@itsrakesh/utils";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Icons } from "@/assets/icons";
import { ErrorBox } from "@/components/ui/error-box";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { constants } from "@/config/constants";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";
import { useState } from "react";
import { TGhostStatus } from ".";

interface DevEditFormProps extends React.HTMLAttributes<HTMLDivElement> {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    api_url: string;
    default_publish_status: TGhostStatus;
}

const formSchema = z.object({
    admin_api_key: z.string().optional(),
    api_url: z.string().url().optional(),
    default_publish_status: z.nativeEnum(constants.ghostStatuses).optional(),
});

export function GhostEditForm({
    default_publish_status,
    setIsOpen,
    ...props
}: Readonly<DevEditFormProps>) {
    const [error, setError] = useState<string | null>(null);

    const { toast } = useToast();
    const utils = trpc.useUtils();

    const { mutateAsync: edit, isLoading: isUpdating } = trpc.updateGhost.useMutation({
        onSuccess: () => {
            toast({
                variant: "success",
                title: "Updated",
                description: "Your Ghost account has been updated successfully.",
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
            api_url: props.api_url,
            default_publish_status: default_publish_status,
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setError(null);
            await edit(data);
        } catch (error) {}
    };

    const isLoading = form.formState.isSubmitting || isUpdating;

    return (
        <div
            className={cn("space-y-4", {
                "animate-shake": error,
            })}
            {...props}
        >
            {error && <ErrorBox title="Could not update Ghost" description={error} />}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="admin_api_key"
                        disabled={isLoading}
                        render={({ field }) => (
                            <FormItem>
                                <div className="space-y-1">
                                    <FormLabel className="flex flex-row space-x-1">
                                        <span>Admin API key</span>{" "}
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
                                                        href={siteConfig.links.ghostAPIKeyGuide}
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
                                        placeholder="*******"
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
                        name="api_url"
                        disabled={isLoading}
                        render={({ field }) => (
                            <FormItem>
                                <div className="space-y-1">
                                    <FormLabel className="flex flex-row space-x-1">
                                        <span>API URL</span>{" "}
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
                                                        href={siteConfig.links.ghostAPIKeyGuide}
                                                        target="_blank"
                                                    >
                                                        Learn
                                                    </Link>
                                                </Button>{" "}
                                                how to get your API URL.
                                            </HoverCardContent>
                                        </HoverCard>
                                    </FormLabel>
                                </div>
                                <FormControl>
                                    <Input
                                        type="url"
                                        placeholder="https://demo.ghost.io"
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
                        disabled={isLoading}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Set default publish status for Ghost</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-row space-x-2"
                                    >
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem
                                                    value={constants.ghostStatuses.DRAFT}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal">Draft</FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem
                                                    value={constants.ghostStatuses.PUBLISHED}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal">Published</FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        disabled={!form.formState.isDirty || isLoading}
                        className="w-full"
                    >
                        <ButtonLoader isLoading={isLoading}>Update</ButtonLoader>
                    </Button>
                </form>
            </Form>
        </div>
    );
}
