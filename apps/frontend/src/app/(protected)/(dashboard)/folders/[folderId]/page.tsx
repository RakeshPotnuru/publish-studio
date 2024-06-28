import { Folder } from "@/components/modules/dashboard/folders/folder";

export default function FolderPage({
  params,
}: Readonly<{ params: { folderId: string } }>) {
  return <Folder folderId={params.folderId} />;
}
