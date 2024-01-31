import Link from "next/link";
import { useState } from "react";

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
    toast,
} from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Icons } from "@/assets/icons";
import { Center } from "@/components/ui/center";
import { ErrorBox } from "@/components/ui/error-box";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";

interface CloudinaryFormProps extends React.HTMLAttributes<HTMLDivElement> {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    type: "edit" | "connect";
}

const formSchema = z.object({
    api_key: z.string().min(1, { message: "API key is required" }),
    cloud_name: z.string().min(1, { message: "Cloud name is required" }),
});

export function CloudinaryForm({ setIsOpen, type, ...props }: Readonly<CloudinaryFormProps>) {
    const [error, setError] = useState<string | null>(null);

    const utils = trpc.useUtils();

    const { mutateAsync: connect, isLoading: isConnecting } = trpc.cloudinary.connect.useMutation({
        onSuccess: async ({ data }) => {
            toast.success(data.message);
            await utils.cloudinary.get.invalidate();
            setIsOpen(false);
        },
        onError: error => {
            setError(error.message);
        },
    });

    const { mutateAsync: edit, isLoading: isUpdating } = trpc.cloudinary.update.useMutation({
        onSuccess: async ({ data }) => {
            toast.success(data.message);
            await utils.cloudinary.get.invalidate();
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
            cloud_name: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            setError(null);
            await (type === "connect" ? connect(data) : edit(data));
        } catch {
            // Ignore
        }
    };

    const isLoading = form.formState.isSubmitting || isConnecting || isUpdating;

    return (
        <div
            className={cn("space-y-4", {
                "animate-shake": error,
            })}
            {...props}
        >
            {error && (
                <Center>
                    <ErrorBox title={`Could not ${type} cloudinary`} description={error} />
                </Center>
            )}
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
                                                        href={
                                                            siteConfig.links.cloudinaryAPIKeyGuide
                                                        }
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
                        name="cloud_name"
                        disabled={isLoading}
                        render={({ field }) => (
                            <FormItem>
                                <div className="space-y-1">
                                    <FormLabel className="flex flex-row space-x-1">
                                        <span>Cloud name</span>{" "}
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
                                                        href={
                                                            siteConfig.links.cloudinaryAPIKeyGuide
                                                        }
                                                        target="_blank"
                                                    >
                                                        Learn
                                                    </Link>
                                                </Button>{" "}
                                                how to get your cloud name.
                                            </HoverCardContent>
                                        </HoverCard>
                                    </FormLabel>
                                    <p className="text-muted-foreground text-xs">
                                        Your cloud name will be encrypted and stored securely.{" "}
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
                                        {...field}
                                    />
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
                        <ButtonLoader isLoading={isLoading}>
                            {type === "connect" ? "Connect" : "Update"}
                        </ButtonLoader>
                    </Button>
                </form>
            </Form>
        </div>
    );
}
