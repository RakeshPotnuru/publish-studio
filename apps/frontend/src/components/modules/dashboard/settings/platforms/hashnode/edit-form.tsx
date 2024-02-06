import { useState } from "react";
import Link from "next/link";

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
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Icons } from "@/assets/icons";
import { ErrorBox } from "@/components/ui/error-box";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";

interface HashnodeEditFormProps extends React.HTMLAttributes<HTMLDivElement> {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  settings: {
    enable_table_of_contents: string;
    send_newsletter: string;
    delisted: string;
  };
}

const formSchema = z.object({
  api_key: z.string().optional(),
  settings: z.object({
    enable_table_of_contents: z.string().default("false").optional(),
    send_newsletter: z.string().default("false").optional(),
    delisted: z.string().default("false").optional(),
  }),
});

export function HashnodeEditForm({
  settings,
  setIsOpen,
  ...props
}: Readonly<HashnodeEditFormProps>) {
  const [error, setError] = useState<string | null>(null);

  const utils = trpc.useUtils();

  const { mutateAsync: edit, isLoading: isUpdating } =
    trpc.platforms.hashnode.update.useMutation({
      onSuccess: async ({ data }) => {
        toast.success(data.message);
        await utils.platforms.getAll.invalidate();
        setIsOpen(false);
      },
      onError: (error) => {
        setError(error.message);
      },
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      api_key: "",
      settings: {
        enable_table_of_contents: settings.enable_table_of_contents,
        send_newsletter: settings.send_newsletter,
        delisted: settings.delisted,
      },
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setError(null);
      await edit({
        ...data,
        settings: {
          enable_table_of_contents:
            data.settings.enable_table_of_contents === "true",
          send_newsletter: data.settings.send_newsletter === "true",
          delisted: data.settings.delisted === "true",
        },
      });
    } catch {
      // Ignore
    }
  };

  const isLoading = form.formState.isSubmitting || isUpdating;

  return (
    <div
      className={cn("space-y-4", {
        "animate-shake": error,
      })}
      {...props}
    >
      {error && (
        <ErrorBox title="Could not update Hashnode" description={error} />
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
                          className="h-max p-0 text-foreground"
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
                  <p className="text-xs text-muted-foreground">
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
                    placeholder="********"
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
            name="settings.send_newsletter"
            disabled={isLoading}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Would you like to send a newsletter to your subscribers after
                  publishing a post?
                </FormLabel>
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
                      <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="true" />
                      </FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="settings.enable_table_of_contents"
            disabled={isLoading}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Would you like to enable table of contents for your posts?
                </FormLabel>
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
                      <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="true" />
                      </FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="settings.delisted"
            disabled={isLoading}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Would you like to hide your posts from Hashnode feed?
                </FormLabel>
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
                      <FormLabel className="font-normal">No</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="true" />
                      </FormControl>
                      <FormLabel className="font-normal">Yes</FormLabel>
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
