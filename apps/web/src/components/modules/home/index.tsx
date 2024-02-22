"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Label,
  toast,
} from "@itsrakesh/ui";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { trpc } from "@/utils/trpc";

const formSchema = z.object({
  email: z.string().email(),
});

export function Home() {
  const { mutateAsync: addToWaitList, isLoading } =
    trpc.admin.invites.addToWaitList.useMutation({
      onSuccess: ({ data }) => {
        toast.success(data.message);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onBlur",
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await addToWaitList(data);

      form.reset();
    } catch {
      // Ignore
    }
  };

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center space-y-10 text-center">
      <h1 className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text py-4 text-4xl font-black text-transparent sm:text-9xl">
        Coming soon
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <Label htmlFor="email" className="text-xl">
            Join wait list
          </Label>
          <div className="flex space-x-2">
            <FormField
              control={form.control}
              name="email"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
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
            <Button type="submit">
              <ButtonLoader isLoading={isLoading}>Join</ButtonLoader>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
