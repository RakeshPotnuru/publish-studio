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
    RadioGroup,
    RadioGroupItem,
} from "@itsrakesh/ui";
import { useForm } from "react-hook-form";
import { AiFillQuestionCircle } from "react-icons/ai";
import { z } from "zod";

const formSchema = z.object({
    api_key: z.string().optional(),
    default_publish_status: z.string().optional(),
    notify_followers: z.string().optional(),
});

export function MediumEditForm(props: z.infer<typeof formSchema>) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            api_key: "",
            default_publish_status: props.default_publish_status,
            notify_followers: props.notify_followers,
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
                                    <span>API key</span> <AiFillQuestionCircle />
                                </FormLabel>
                                <p className="text-muted-foreground text-xs">
                                    Your API key will be encrypted and stored securely.{" "}
                                    <Button variant="link" size="sm" className="h-max p-0">
                                        Learn more
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
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Edit default publish status for Medium</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-row space-x-2"
                                >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="draft" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Draft</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="publish" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Publish</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="unlisted" />
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
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Do you want to notify your Medium followers on publishing a post?
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
                    disabled={form.formState.isSubmitting || !form.formState.isDirty}
                >
                    Connect
                </Button>
            </form>
        </Form>
    );
}
