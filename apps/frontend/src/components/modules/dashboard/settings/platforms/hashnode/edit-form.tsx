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
} from "@itsrakesh/ui";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Icons } from "@/assets/icons";
import { siteConfig } from "@/config/site";

const formSchema = z.object({
    api_key: z.string().optional(),
    username: z.string().optional(),
});

export function HashnodeEditForm(props: z.infer<typeof formSchema>) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            api_key: "",
            username: props.username,
        },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="api_key"
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
                                                    href={siteConfig.links.hashnodeAPIKeyGuide}
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
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="username"
                                        disabled={form.formState.isSubmitting}
                                        {...field}
                                    />
                                </FormControl>
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
                    Connect
                </Button>
            </form>
        </Form>
    );
}
