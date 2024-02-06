import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogContent,
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
  toast,
} from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import type { IProject } from "@publish-studio/core";
import { constants } from "@publish-studio/core/src/config/constants";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ErrorBox } from "@/components/ui/error-box";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { Tooltip } from "@/components/ui/tooltip";
import { trpc } from "@/utils/trpc";

interface RenameProjectProps extends React.HTMLAttributes<HTMLDialogElement> {
  project: IProject;
}

const formSchema = z.object({
  name: z
    .string()
    .min(
      constants.project.title.MIN_LENGTH,
      `Name must contain at least ${constants.project.name.MIN_LENGTH} characters`,
    )
    .max(
      constants.project.name.MAX_LENGTH,
      `Name must not exceed ${constants.project.name.MAX_LENGTH} characters`,
    ),
});

export function RenameProject({
  children,
  project,
  ...props
}: Readonly<RenameProjectProps>) {
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const utils = trpc.useUtils();

  const { mutateAsync: rename, isLoading: isRenaming } =
    trpc.projects.update.useMutation({
      onSuccess: async () => {
        toast.success("Project renamed successfully");
        setOpen(false);
        await utils.projects.getById.invalidate();
      },
      onError: (error) => {
        setError(error.message);
      },
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      name: project.name,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await rename({
        id: project._id,
        project: {
          name: data.name,
        },
      });
    } catch {
      // Ignore
    }
  };

  const isLoading = form.formState.isSubmitting || isRenaming;

  return (
    <Dialog open={open} onOpenChange={setOpen} {...props}>
      <Tooltip content="Rename project">
        <DialogTrigger asChild>{children}</DialogTrigger>
      </Tooltip>
      <DialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Rename your project</DialogTitle>
        </DialogHeader>
        <div
          className={cn("space-y-2", {
            "animate-shake": error,
          })}
        >
          {error && (
            <ErrorBox title="Could not rename project" description={error} />
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                disabled={isLoading}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter a name for your project"
                        autoFocus
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Your project name provides important context for
                      generative AI. So make it descriptive, but not too long.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                size="sm"
                className="w-full"
                disabled={!form.formState.isDirty || isLoading}
              >
                <ButtonLoader isLoading={isLoading}>Continue</ButtonLoader>
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
