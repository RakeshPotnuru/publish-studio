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
import { GhostStatus } from "@publish-studio/core/src/config/constants";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Icons } from "@/assets/icons";
import { ErrorBox } from "@/components/ui/error-box";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { siteConfig } from "@/config/site";
import useUserStore from "@/lib/store/user";
import { trpc } from "@/utils/trpc";

interface DevConnectFormProps extends React.HTMLAttributes<HTMLDivElement> {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const formSchema = z.object({
  admin_api_key: z.string().min(1, { message: "Admin API key is required" }),
  api_url: z.string().min(1, { message: "API URL is required" }).url({
    message: "API URL must be a valid URL",
  }),
  status: z.nativeEnum(GhostStatus).default(GhostStatus.DRAFT),
});

export function GhostConnectForm({
  setIsOpen,
  ...props
}: Readonly<DevConnectFormProps>) {
  const [error, setError] = useState<string | null>(null);

  const utils = trpc.useUtils();
  const { setUser, setIsLoading } = useUserStore();

  const { refetch: getUser } = trpc.auth.getMe.useQuery(undefined, {
    enabled: false,
    onSuccess: ({ data }) => {
      setUser(data.user);
      setIsLoading(false);
    },
  });

  const { mutateAsync: connect, isLoading: isConnecting } =
    trpc.platforms.ghost.connect.useMutation({
      onSuccess: async ({ data }) => {
        toast.success(data.message);
        await utils.platforms.getAll.invalidate();

        setIsLoading(true);
        await getUser();

        setIsOpen(false);
      },
      onError: (error) => {
        setError(error.message);
      },
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      admin_api_key: "",
      api_url: "",
      status: GhostStatus.DRAFT,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setError(null);
      await connect(data);
    } catch {
      // Ignore
    }
  };

  const isLoading = form.formState.isSubmitting || isConnecting;

  return (
    <div
      className={cn("space-y-4", {
        "animate-shake": error,
      })}
      {...props}
    >
      {error && (
        <ErrorBox title="Could not connect Ghost" description={error} />
      )}
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
                <FormLabel>Set default publish status for Ghost</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-row space-x-2"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={GhostStatus.DRAFT} />
                      </FormControl>
                      <FormLabel className="font-normal">Draft</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={GhostStatus.PUBLISHED} />
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
            <ButtonLoader isLoading={isLoading}>Connect</ButtonLoader>
          </Button>
        </form>
      </Form>
    </div>
  );
}
