import type { Metadata } from "next";

import { Folders } from "@/components/modules/dashboard/folders";

export const metadata: Metadata = {
    title: "Folders",
    description: "Find your folders",
};

export default function FoldersPage() {
    return <Folders />;
}
