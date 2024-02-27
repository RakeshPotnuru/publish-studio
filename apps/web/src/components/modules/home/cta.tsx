import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  toast,
} from "@itsrakesh/ui";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Footer } from "@/components/common/layout/footer";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { MagicBorderBtn } from "@/components/ui/magic-border-btn";
import { trpc } from "@/utils/trpc";

const formSchema = z.object({
  email: z.string().email(),
});

export function Cta() {
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
    <div
      id="cta"
      className="relative flex h-[20rem] w-full flex-col items-center justify-center rounded-md bg-neutral-950 antialiased sm:h-[40rem]"
    >
      <div className="mx-auto max-w-2xl p-4">
        <h1 className="relative z-10 bg-gradient-to-b from-neutral-200 to-neutral-600 bg-clip-text text-center font-sans text-lg font-bold text-transparent md:text-7xl">
          Join the waitlist
        </h1>
        <p className="relative z-10 mx-auto my-2 max-w-lg text-center text-sm text-neutral-500">
          Get early access to the platform when it launches.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="relative z-10 flex w-full flex-row items-center justify-center space-x-2"
          >
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
                      className="relative z-10 mt-4 w-full rounded-lg border border-neutral-800 bg-neutral-950 placeholder:text-neutral-700 focus:ring-2 focus:ring-teal-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <MagicBorderBtn type="submit" className="mt-4">
              <ButtonLoader isLoading={isLoading}>Join</ButtonLoader>
            </MagicBorderBtn>
          </form>
        </Form>

        <Footer className="relative z-10 mt-20" />

        <BackgroundBeams />
      </div>
    </div>
  );
}
