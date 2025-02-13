import Link from "next/link";

import { Button } from "@itsrakesh/ui";

import { Icons } from "@/assets/icons";
import { Center } from "@/components/ui/center";
import { ErrorBox } from "@/components/ui/error-box";
import { Heading } from "@/components/ui/heading";
import { FoldersLoader } from "@/components/ui/loaders/folders-loader";
import { siteConfig } from "@/config/site";
import { shortenText } from "@/utils/text-shortener";
import { trpc } from "@/utils/trpc";

import { NewFolderDialog } from "../folders/new-folder";

export function RecentFolders() {
  const { data, isFetching, error } = trpc.folders.getAll.useQuery({
    pagination: {
      page: 1,
      limit: 5,
    },
  });

  const folders = data?.data.folders ?? [];

  const foldersBodyView =
    folders.length > 0 ? (
      <>
        {folders.map((folder) => (
          <Button
            key={folder._id.toString()}
            title={folder.name}
            variant="secondary"
            className="flex w-64 justify-start"
            asChild
          >
            <Link
              href={`${siteConfig.pages.folders.link}/${folder._id.toString()}`}
            >
              <Icons.Folder className="mr-2 size-4" />
              {shortenText(folder.name, 27)}
            </Link>
          </Button>
        ))}
        <Button variant="outline" asChild>
          <Link href={siteConfig.pages.folders.link}>
            All folders <Icons.Right className="ml-2 size-4" />
          </Link>
        </Button>
      </>
    ) : (
      <Center className="col-span-4 w-full flex-col space-y-4 p-4 text-gray-500">
        <p>No folders in sight. Create one to keep things neat and tidy!</p>
        <NewFolderDialog>
          <Button variant="secondary">
            <Icons.Add className="mr-2 size-4" /> New Folder
          </Button>
        </NewFolderDialog>
      </Center>
    );

  const foldersView = error ? (
    <Center>
      <ErrorBox title="Error fetching folders" description={error.message} />
    </Center>
  ) : (
    foldersBodyView
  );

  return (
    <div className="space-y-4">
      <Heading level={3}>Folders</Heading>
      <div className="flex flex-wrap gap-4 rounded-lg border p-4">
        {isFetching ? <FoldersLoader size="sm" count={6} /> : foldersView}
      </div>
    </div>
  );
}
