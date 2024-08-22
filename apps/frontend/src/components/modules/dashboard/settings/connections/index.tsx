"use client";

import type { IPlatform } from "@publish-studio/core";
import { Platform } from "@publish-studio/core/src/config/constants";

import { Center } from "@/components/ui/center";
import { ErrorBox } from "@/components/ui/error-box";
import { Heading } from "@/components/ui/heading";
import { siteConfig } from "@/config/site";
import { trpc } from "@/utils/trpc";

import Header from "../common/header";
import { Cloudinary } from "./integrations/cloudinary";
import { Blogger } from "./platforms/blogger";
import { DevTo } from "./platforms/dev";
import { Ghost } from "./platforms/ghost";
import { Hashnode } from "./platforms/hashnode";
import { Medium } from "./platforms/medium";
import { WordPress } from "./platforms/wordpress";

export function Connections() {
  const {
    data,
    isFetching,
    error: platformsError,
  } = trpc.platforms.getAll.useQuery({
    pagination: { page: 1, limit: 10 },
  });

  const platforms = data?.data.platforms;

  const devto: IPlatform<typeof Platform.DEVTO> | undefined = platforms?.find(
    (platform) => platform.name === Platform.DEVTO,
  )?.data;
  const medium: IPlatform<typeof Platform.MEDIUM> | undefined = platforms?.find(
    (platform) => platform.name === Platform.MEDIUM,
  )?.data;
  const hashnode: IPlatform<typeof Platform.HASHNODE> | undefined =
    platforms?.find((platform) => platform.name === Platform.HASHNODE)?.data;
  const ghost: IPlatform<typeof Platform.GHOST> | undefined = platforms?.find(
    (platform) => platform.name === Platform.GHOST,
  )?.data;
  const wordpress: IPlatform<typeof Platform.WORDPRESS> | undefined =
    platforms?.find((platform) => platform.name === Platform.WORDPRESS)?.data;
  const blogger: IPlatform<typeof Platform.BLOGGER> | undefined =
    platforms?.find((platform) => platform.name === Platform.BLOGGER)?.data;

  const {
    data: cloudinary,
    isFetching: isCloudinaryLoading,
    error: cloudinaryError,
  } = trpc.cloudinary.get.useQuery();

  return (
    <Header
      title={siteConfig.pages.settings.connections.title}
      description={siteConfig.pages.settings.connections.description}
    >
      <div className="space-y-4">
        <Heading level={2}>Platforms</Heading>
        {platformsError && (
          <Center>
            <ErrorBox title="Error" description={platformsError.message} />
          </Center>
        )}
        <div className="grid grid-cols-2 gap-4">
          <Blogger isLoading={isFetching} data={blogger} />
          <DevTo isLoading={isFetching} data={devto} />
          <Ghost isLoading={isFetching} data={ghost} />
          <Hashnode isLoading={isFetching} data={hashnode} />
          <Medium isLoading={isFetching} data={medium} />
          <WordPress isLoading={isFetching} data={wordpress} />
        </div>
      </div>
      <div className="space-y-4">
        <Heading level={2}>Integrations</Heading>
        {cloudinaryError && (
          <Center>
            <ErrorBox title="Error" description={cloudinaryError.message} />
          </Center>
        )}
        <div className="grid grid-cols-2 gap-4">
          <Cloudinary
            isLoading={isCloudinaryLoading}
            data={cloudinary?.data.integration ?? undefined}
          />
        </div>
      </div>
    </Header>
  );
}
