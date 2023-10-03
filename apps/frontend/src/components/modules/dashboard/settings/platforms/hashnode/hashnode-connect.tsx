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
} from "@itsrakesh/ui";
import { useForm } from "react-hook-form";
import { AiFillQuestionCircle } from "react-icons/ai";
import { z } from "zod";

const formSchema = z.object({
    api_key: z.string().nonempty("API key is required"),
    username: z.string().nonempty("Username is required"),
});

export function HashnodeConnectForm() {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            api_key: "",
            username: "",
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
                >
                    Connect
                </Button>
            </form>
        </Form>
    );
}
