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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  toast,
} from "@itsrakesh/ui";
import { cn } from "@itsrakesh/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Icons } from "@/assets/icons";
import { Center } from "@/components/ui/center";
import { ErrorBox } from "@/components/ui/error-box";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { trpc } from "@/utils/trpc";

interface BloggerEditFormProps extends React.HTMLAttributes<HTMLDivElement> {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  blog_id: string;
  blog_url: string;
  status: string;
}

const formSchema = z.object({
  blog_id: z.string({
    required_error: "Please select a blog.",
  }),
  status: z.string().optional(),
});

export function BloggerEditForm({
  setIsOpen,
  ...props
}: Readonly<BloggerEditFormProps>) {
  const [error, setError] = useState<string | null>(null);
  const [blogs, setBlogs] = useState<
    | {
        id: string;
        url: string;
      }[]
    | undefined
  >([
    {
      id: props.blog_id,
      url: props.blog_url,
    },
  ]);

  const utils = trpc.useUtils();

  const {
    refetch: fetchBlogs,
    error: fetchBlogsError,
    isFetching,
  } = trpc.platforms.blogger.getBlogs.useQuery(undefined, {
    enabled: false,
  });

  const { mutateAsync: edit, isLoading: isUpdating } =
    trpc.platforms.blogger.update.useMutation({
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
      blog_id: props.blog_id,
      status: props.status,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const blogUrl = blogs?.find((blog) => blog.id === data.blog_id)?.url;
      if (blogUrl) {
        await edit({
          ...data,
          blog_url: blogUrl,
          status: data.status === "true",
        });
      }
    } catch {
      // Ignore
    }
  };

  const handleFetchBlogs = async () => {
    try {
      const { data } = await fetchBlogs();
      setBlogs(data?.data.blogs);
    } catch {
      // Ignore
    }
  };

  const isLoading = form.formState.isSubmitting || isUpdating || isFetching;

  return (
    <div
      className={cn("space-y-4", {
        "animate-shake": error,
      })}
      {...props}
    >
      {fetchBlogsError && (
        <Center>
          <ErrorBox
            title="Could not fetch blogs"
            description={fetchBlogsError.message}
          />
        </Center>
      )}
      {error && (
        <Center>
          <ErrorBox title="Could not update Blogger" description={error} />
        </Center>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="blog_id"
            disabled={isLoading}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Change blog</FormLabel>
                <div className="flex flex-row space-x-2">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a blog" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isFetching ? (
                        <div className="space-y-1">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Skeleton
                              key={`skeleton-${index.toString()}`}
                              className="h-6 w-full"
                            />
                          ))}
                        </div>
                      ) : (
                        blogs?.map((blog) => (
                          <SelectItem key={blog.id} value={blog.id}>
                            {blog.url.split("/")[2]}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    onClick={handleFetchBlogs}
                    variant="secondary"
                    disabled={isLoading}
                  >
                    <ButtonLoader isLoading={isFetching}>
                      <Icons.Refresh className="mr-2 size-4" />
                      Refetch
                    </ButtonLoader>
                  </Button>
                </div>
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
                <FormLabel>Update publish status for Blogger</FormLabel>
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
                      <FormLabel className="font-normal">Draft</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="false" />
                      </FormControl>
                      <FormLabel className="font-normal">Publish</FormLabel>
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
            <ButtonLoader isLoading={isUpdating}>Update</ButtonLoader>
          </Button>
        </form>
      </Form>
    </div>
  );
}
