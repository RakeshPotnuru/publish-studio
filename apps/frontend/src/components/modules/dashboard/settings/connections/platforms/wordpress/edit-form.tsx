import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  RadioGroup,
  RadioGroupItem,
  toast,
} from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import type { IWordPress } from "@publish-studio/core";
import { WordPressStatus } from "@publish-studio/core/src/config/constants";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ErrorBox } from "@/components/ui/error-box";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { trpc } from "@/utils/trpc";

interface WordPressEditFormProps extends React.HTMLAttributes<HTMLDivElement> {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  status: IWordPress["status"];
  publicize: string;
}

const formSchema = z.object({
  api_key: z.string().optional(),
  status: z.nativeEnum(WordPressStatus),
  publicize: z.string(),
});

export function WordPressEditForm({
  setIsOpen,
  status,
  publicize,
  ...props
}: Readonly<WordPressEditFormProps>) {
  const [error, setError] = useState<string | null>(null);

  const utils = trpc.useUtils();

  const { mutateAsync: edit, isLoading: isUpdating } =
    trpc.platforms.wordpress.update.useMutation({
      onSuccess: async ({ data }) => {
        toast.success(data.message);
        await utils.platforms.getAll.invalidate();
      },
      onError: (error) => {
        setError(error.message);
      },
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      api_key: "",
      status,
      publicize,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setError(null);
      await edit({
        ...data,
        publicize: data.publicize === "true",
      });
      setIsOpen(false);
    } catch {
      // Ignore
    }
  };

  const isLoading = isUpdating || form.formState.isSubmitting;

  return (
    <div
      className={cn("space-y-4", {
        "animate-shake": error,
      })}
      {...props}
    >
      {error && (
        <ErrorBox title="Could not update WordPress" description={error} />
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="status"
            disabled={isLoading}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Edit default publish status for WordPress</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-row space-x-2"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={WordPressStatus.DRAFT} />
                      </FormControl>
                      <FormLabel className="font-normal">Draft</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={WordPressStatus.PUBLISH} />
                      </FormControl>
                      <FormLabel className="font-normal">Publish</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={WordPressStatus.PRIVATE} />
                      </FormControl>
                      <FormLabel className="font-normal">Private</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={WordPressStatus.PENDING} />
                      </FormControl>
                      <FormLabel className="font-normal">Pending</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="publicize"
            disabled={isLoading}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Do you want to share your posts to external services?
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
