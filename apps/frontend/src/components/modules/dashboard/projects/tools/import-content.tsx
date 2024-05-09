import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Icons } from "@/assets/icons";
import type { MenuProps } from "@/components/editor/menu/fixed-menu";
import { ErrorBox } from "@/components/ui/error-box";
import { Heading } from "@/components/ui/heading";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { trpc } from "@/utils/trpc";

const urlFormSchema = z.object({
  url: z.string().url("Please enter a valid URL."),
});

export function ImportMarkdown({ editor }: MenuProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const urlForm = useForm<z.infer<typeof urlFormSchema>>({
    mode: "onBlur",
    resolver: zodResolver(urlFormSchema),
    defaultValues: {
      url: "",
    },
  });

  const errorMessage =
    "Content import unsuccessful. This may be due to various reasons, including content being restricted behind a paywall, requiring authentication, or containing sensitive information.";

  const { mutateAsync: getArticleContent, isLoading } =
    trpc.tools.scraper.getArticleContent.useMutation({
      onSuccess: ({ data }) => {
        if (!data.article) {
          setError(errorMessage);
          return;
        }
        editor.commands.setContent(data?.article ?? "");
        urlForm.reset();
        setOpen(false);
      },
      onError: () => {
        setError(errorMessage);
      },
    });

  const onUrlSubmit = async (data: z.infer<typeof urlFormSchema>) => {
    try {
      setError(null);
      await getArticleContent(data.url);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="space-y-2">
      <div>
        <Heading level={5}>Import content</Heading>
        <p className="text-sm text-muted-foreground">
          Import content from URL into the editor.
        </p>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="w-full">
            <Icons.Import className="mr-2 size-4" /> Import
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <span>Import Content</span>{" "}
              <Badge variant="secondary">Beta</Badge>
            </DialogTitle>
            <DialogDescription className="text-warning">
              ⚠️ Warning: This action will replace the current content in the
              editor.
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="markdown">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="url">URL</TabsTrigger>
            </TabsList>
            <TabsContent value="url">
              <div
                className={cn("space-y-2", {
                  "animate-shake": error,
                })}
              >
                {error && <ErrorBox title="Error" description={error} />}
                <Form {...urlForm}>
                  <form
                    onSubmit={urlForm.handleSubmit(onUrlSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={urlForm.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              className="w-full"
                              placeholder="https://example.com/blog/123"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            To avoid any copyright issues, please make sure you
                            have the right to import this content. Also,
                            double-check that the link is publicly accessible.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={!urlForm.formState.isDirty || isLoading}
                    >
                      <ButtonLoader isLoading={isLoading}>Submit</ButtonLoader>
                    </Button>
                  </form>
                </Form>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
