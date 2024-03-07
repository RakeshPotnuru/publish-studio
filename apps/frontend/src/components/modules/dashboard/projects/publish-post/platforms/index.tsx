import Link from "next/link";

import {
  Badge,
  Button,
  Checkbox,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Skeleton,
} from "@itsrakesh/ui";
import type { IPlatform, IProject } from "@publish-studio/core";
import {
  Platform,
  PostStatus,
} from "@publish-studio/core/src/config/constants";
import { intlFormatDistance } from "date-fns";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";

import { Icons } from "@/assets/icons";
import { Images } from "@/assets/images";
import { Center } from "@/components/ui/center";
import { ErrorBox } from "@/components/ui/error-box";
import { Heading } from "@/components/ui/heading";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";

import type { formSchema } from "../form-schema";
import { Blogger } from "./blogger";
import { Dev } from "./dev";
import { Ghost } from "./ghost";
import { Medium } from "./medium";
import { WordPress } from "./wordpress";

interface IPlatformConfig {
  label: string;
  value: (typeof Platform)[keyof typeof Platform];
  logo: string;
  component: (
    form: UseFormReturn<z.infer<typeof formSchema>>,
    isLoading: boolean,
  ) => React.JSX.Element;
}

const platformConfig: IPlatformConfig[] = [
  {
    label: "Dev.to",
    value: Platform.DEVTO,
    logo: Images.devLogo,
    component: (form: UseFormReturn<z.infer<typeof formSchema>>, isLoading) => (
      <Dev form={form} isLoading={isLoading} />
    ),
  },
  {
    label: "Medium",
    value: Platform.MEDIUM,
    logo: Images.mediumLogo,
    component: (form: UseFormReturn<z.infer<typeof formSchema>>, isLoading) => (
      <Medium form={form} isLoading={isLoading} />
    ),
  },
  {
    label: "Hashnode",
    value: Platform.HASHNODE,
    logo: Images.hashnodeLogo,
    component: () => <></>,
  },
  {
    label: "Ghost",
    value: Platform.GHOST,
    logo: Images.ghostLogo,
    component: (form: UseFormReturn<z.infer<typeof formSchema>>, isLoading) => (
      <Ghost form={form} isLoading={isLoading} />
    ),
  },
  {
    label: "WordPress",
    value: Platform.WORDPRESS,
    logo: Images.wordpressLogo,
    component: (form: UseFormReturn<z.infer<typeof formSchema>>, isLoading) => (
      <WordPress form={form} isLoading={isLoading} />
    ),
  },
  {
    label: "Blogger",
    value: Platform.BLOGGER,
    logo: Images.bloggerLogo,
    component: (form: UseFormReturn<z.infer<typeof formSchema>>, isLoading) => (
      <Blogger form={form} isLoading={isLoading} />
    ),
  },
];

interface PlatformsFieldProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  connectedPlatforms: IPlatform["name"][];
  isLoading: boolean;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  onRefresh: () => void;
  scheduledAt?: Date;
  projectId: IProject["_id"];
}

export const PlatformsField = ({
  form,
  connectedPlatforms,
  isLoading,
  onSubmit,
  onRefresh,
  scheduledAt,
  projectId,
}: PlatformsFieldProps) => {
  const { data, error, isFetching } =
    trpc.post.getAllByProjectId.useQuery(projectId);

  const publishedPlatforms = data?.data.posts;

  const getPost = (platform: IPlatform["name"]) => {
    return publishedPlatforms?.find(
      (publishedPlatform) => publishedPlatform.platform === platform,
    );
  };

  const bodyView = platformConfig
    .filter((platform) => connectedPlatforms.includes(platform.value))
    .map((platform) => (
      <FormField
        key={platform.value}
        control={form.control}
        name="platforms"
        disabled={isLoading}
        render={({ field }) => {
          return (
            <div className="flex flex-col space-y-2 rounded-md border p-2">
              {isFetching ? (
                <Skeleton className="h-8 w-full" />
              ) : (
                <div className="flex flex-row justify-between">
                  <FormItem
                    key={platform.value}
                    className="flex items-center space-x-2 space-y-0"
                  >
                    {getPost(platform.value)?.status !== PostStatus.SUCCESS && (
                      <FormControl>
                        <Checkbox
                          checked={field.value.includes(platform.value)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, platform.value])
                              : field.onChange(
                                  field.value.filter(
                                    (value) => value !== platform.value,
                                  ),
                                );
                          }}
                          {...field}
                        />
                      </FormControl>
                    )}
                    <FormLabel className="text-sm font-semibold">
                      {platform.label}
                    </FormLabel>
                  </FormItem>

                  {/* success */}
                  {getPost(platform.value)?.status === PostStatus.SUCCESS &&
                    getPost(platform.value)?.published_url && (
                      <div className="flex items-center space-x-2">
                        <Badge variant="success">Published</Badge>
                        <Button variant="link" size="sm" asChild>
                          <Link
                            href={getPost(platform.value)?.published_url ?? ""}
                            target="_blank"
                          >
                            View
                            <Icons.ExternalLink className="ml-1" />
                          </Link>
                        </Button>
                      </div>
                    )}

                  {/* error */}
                  {getPost(platform.value)?.status === PostStatus.ERROR && (
                    <div className="flex items-center space-x-2">
                      <Badge variant="destructive">Failed</Badge>
                      <Button
                        onClick={() => {
                          form.setValue("platforms", [
                            ...field.value.filter(
                              (value) => value !== platform.value,
                            ),
                            platform.value,
                          ]);
                          form.handleSubmit(onSubmit);
                        }}
                        variant="ghost"
                        size="sm"
                        disabled={isLoading}
                      >
                        <ButtonLoader isLoading={isLoading}>Retry</ButtonLoader>
                      </Button>
                    </div>
                  )}

                  {/* pending */}
                  {getPost(platform.value)?.status === PostStatus.PENDING && (
                    <div className="flex items-center space-x-2">
                      <Badge variant="warning">Pending</Badge>
                      {scheduledAt && new Date(scheduledAt) > new Date() ? (
                        <p className="text-sm text-muted-foreground">
                          {intlFormatDistance(
                            new Date(scheduledAt),
                            new Date(),
                            {
                              style: "short",
                            },
                          )}
                        </p>
                      ) : (
                        <Button
                          type="button"
                          onClick={onRefresh}
                          variant="ghost"
                          size="sm"
                        >
                          <ButtonLoader isLoading={isLoading}>
                            Refresh
                          </ButtonLoader>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
              {field.value.includes(platform.value) &&
                platform.component(form, isLoading)}
            </div>
          );
        }}
      />
    ));

  return (
    <FormField
      control={form.control}
      name="platforms"
      disabled={isLoading}
      render={() => (
        <FormItem className="w-full">
          <div className="mb-4">
            <Heading className="text-base">Platforms</Heading>
            <FormDescription>
              Select platforms to publish your post to.{" "}
              <Button
                type="button"
                variant="link"
                className="h-max p-0 text-xs"
                asChild
              >
                <Link href={siteConfig.pages.settings.connections.link}>
                  Connect more
                </Link>
              </Button>
            </FormDescription>
          </div>
          {error ? (
            <Center>
              <ErrorBox
                title="Failed to fetch posts"
                description={error.message}
              />
            </Center>
          ) : (
            bodyView
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
