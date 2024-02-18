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

const formSchema = z.object({
  email: z.string().email(),
});

export function Home() {
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onBlur",
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    toast.success("Thanks for joining the wait list!");
    form.reset();
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
              // disabled={isLoading}
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
            <Button type="submit">Join</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
