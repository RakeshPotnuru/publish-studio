import { Button } from "@itsrakesh/ui";
import { format } from "date-fns";
import { NodeHtmlMarkdown } from "node-html-markdown";

import type { IProject } from "@publish-studio/core";

import { Icons } from "@/assets/icons";
import type { MenuProps } from "@/components/modules/dashboard/projects/editor/menu/fixed-menu";
import { Heading } from "@/components/ui/heading";

interface DownloadProjectProps extends MenuProps {
    project: IProject;
}

export function DownloadProject({ editor, project }: Readonly<DownloadProjectProps>) {
    const handlePDF = () => {};

    const handleCSV = () => {
        const nhm = new NodeHtmlMarkdown();

        const csvContent = [
            "title, created_at, content",
            `${project.title}, ${format(new Date(project.created_at), "PPPp")}, ${nhm.translate(
                editor.getHTML(),
            )}`,
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${project.title}.csv`;

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleTXT = () => {
        const nhm = new NodeHtmlMarkdown();

        const txtContent = [
            `${project.title}`,
            `${format(new Date(project.created_at), "PPPp")}`,
            `${nhm.translate(editor.getHTML())}`,
        ].join("\n");

        const blob = new Blob([txtContent], { type: "text/plain;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${project.title}.txt`;

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleMD = () => {
        const nhm = new NodeHtmlMarkdown();

        const mdContent = [
            `# ${project.title}`,
            `## ${format(new Date(project.created_at), "PPPp")}`,
            `${nhm.translate(editor.getHTML())}`,
        ].join("\n");

        const blob = new Blob([mdContent], { type: "text/markdown;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${project.title}.md`;

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-2">
            <div>
                <Heading level={5}>Download</Heading>
                <p className="text-muted-foreground text-sm">
                    Download the project in a variety of formats.
                </p>
            </div>
            <div className="flex flex-wrap gap-2">
                <Button
                    onClick={handlePDF}
                    size="sm"
                    className="bg-pdf text-pdf-foreground hover:opacity-80"
                >
                    <Icons.Pdf className="mr-2 size-4" /> PDF
                </Button>
                <Button
                    onClick={handleCSV}
                    size="sm"
                    className="bg-csv text-csv-foreground hover:opacity-80"
                >
                    <Icons.Csv className="mr-2 size-4" /> CSV
                </Button>
                <Button
                    onClick={handleTXT}
                    size="sm"
                    className="bg-txt text-txt-foreground hover:opacity-80"
                >
                    <Icons.Txt className="mr-2 size-4" /> TXT
                </Button>
                <Button
                    onClick={handleMD}
                    size="sm"
                    className="bg-markdown text-markdown-foreground hover:opacity-80"
                >
                    <Icons.Markdown className="mr-2 size-4" /> MD
                </Button>
            </div>
        </div>
    );
}
