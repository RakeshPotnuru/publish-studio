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
    toast,
} from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Icons } from "@/assets/icons";
import { ErrorBox } from "@/components/ui/error-box";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { constants } from "@/config/constants";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";

interface MediumConnectFormProps extends React.HTMLAttributes<HTMLDivElement> {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const formSchema = z.object({
    api_key: z.string().min(1, { message: "API key is required" }),
    status: z.nativeEnum(constants.mediumStatuses).default(constants.mediumStatuses.DRAFT),
    notify_followers: z.string().default("false"),
});

export function MediumConnectForm({ setIsOpen, ...props }: Readonly<MediumConnectFormProps>) {
    const [error, setError] = useState<string | null>(null);

    const utils = trpc.useUtils();

    const { mutateAsync: connect, isLoading: isConnecting } =
        trpc.platforms.medium.connect.useMutation({
            onSuccess: ({ data }) => {
                toast.success(data.message);
                utils.platforms.getAll.invalidate();
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
            status: constants.mediumStatuses.DRAFT,
            notify_followers: "false",
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setError(null);
            await connect({
                ...data,
                notify_followers: data.notify_followers === "true",
            });
        } catch (error) {}
    };

    const isLoading = form.formState.isSubmitting || isConnecting;

    return (
        <div
            className={cn("space-y-4", {
                "animate-shake": error,
            })}
            {...props}
        >
            {error && <ErrorBox title="Could not connect Medium" description={error} />}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="api_key"
                        disabled={isLoading}
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
                                                        href={siteConfig.links.mediumAPIKeyGuide}
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
                        name="status"
                        disabled={isLoading}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Set default publish status for Medium</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-row space-x-2"
                                    >
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem
                                                    value={constants.mediumStatuses.DRAFT}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal">Draft</FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem
                                                    value={constants.mediumStatuses.PUBLIC}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal">Public</FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem
                                                    value={constants.mediumStatuses.UNLISTED}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal">Unlisted</FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="notify_followers"
                        disabled={isLoading}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Do you want to notify your Medium followers on publishing a
                                    post?
                                </FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-row space-x-2"
                                    >
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="true" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Yes</FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="false" />
                                            </FormControl>
                                            <FormLabel className="font-normal">No</FormLabel>
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
                        <ButtonLoader isLoading={isLoading}>Connect</ButtonLoader>
                    </Button>
                </form>
            </Form>
        </div>
    );
}
