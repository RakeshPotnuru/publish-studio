import type { Metadata } from "next";

import { Folder } from "@/components/modules/dashboard/folders/folder";

export const metadata: Metadata = {
    title: "Folder Name",
};

export default function FolderPage() {
    return <Folder />;
}
