import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogContent,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  toast,
} from "@itsrakesh/ui";
import { SnippetType } from "@publish-studio/core/src/config/constants";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Icons } from "@/assets/icons";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { useSnippets } from "@/lib/stores/snippets";
import { trpc } from "@/utils/trpc";

interface NewSnippetProps {
  isLoading: boolean;
}

export default function NewSnippet({ isLoading }: NewSnippetProps) {
  return (
    <div className="flex items-center">
      <NewTextSnippet isLoading={isLoading} />
      <NewLinkSnippet isLoading={isLoading} />
    </div>
  );
}

interface NewTextSnippetProps {
  isLoading: boolean;
}

function NewTextSnippet({ isLoading }: NewTextSnippetProps) {
  const { mutateAsync: create, isLoading: isCreating } =
    trpc.snippets.create.useMutation({
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const { addSnippet, setActiveSnippet } = useSnippets();

  const handleCreate = async () => {
    try {
      const { data } = await create({
        type: SnippetType.TEXT,
      });
      addSnippet(data.snippet);
      setActiveSnippet(data.snippet);
    } catch (error) {
      console.error(error);
    }
  };

  const isDisabled = isLoading || isCreating;

  return (
    <Button
      onClick={handleCreate}
      variant="outline"
      size="sm"
      className="rounded-none rounded-l-md"
      disabled={isDisabled}
    >
      <ButtonLoader isLoading={isCreating}>
        <Icons.Add className="mr-2 size-4" />
        New
      </ButtonLoader>
    </Button>
  );
}

interface NewLinkSnippetProps {
  isLoading: boolean;
}

const linkFormSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

function NewLinkSnippet({ isLoading }: NewLinkSnippetProps) {
  const [isLinkDialogOpen, setLinkDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof linkFormSchema>>({
    resolver: zodResolver(linkFormSchema),
    mode: "onBlur",
    defaultValues: {
      url: "",
    },
  });

  const { mutateAsync: create, isLoading: isCreating } =
    trpc.snippets.create.useMutation({
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const { addSnippet, setActiveSnippet } = useSnippets();

  const onSubmit = async (values: z.infer<typeof linkFormSchema>) => {
    try {
      const { data } = await create({
        type: SnippetType.LINK,
        link: values.url,
      });

      addSnippet(data.snippet);
      setActiveSnippet(data.snippet);

      setLinkDialogOpen(false);

      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  const isDisabled = isLoading || form.formState.isSubmitting || isCreating;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-none rounded-r-md text-xs"
            disabled={isDisabled}
          >
            <Icons.CaretDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              setLinkDialogOpen(true);
            }}
          >
            New Link
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={isLinkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-4 space-y-4"
            >
              <FormField
                control={form.control}
                name="url"
                disabled={isDisabled}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Enter URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="w-full"
                disabled={isDisabled || !form.formState.isDirty}
              >
                <ButtonLoader isLoading={isCreating}>Continue</ButtonLoader>
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
