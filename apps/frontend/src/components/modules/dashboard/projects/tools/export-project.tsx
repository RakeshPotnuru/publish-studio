import { Button } from "@itsrakesh/ui";
import type { IProject } from "@publish-studio/core";
import type { JSONContent } from "@tiptap/core";
import { format } from "date-fns";

import { Icons } from "@/assets/icons";
import type { MenuProps } from "@/components/editor/menu/fixed-menu";
import { serialize } from "@/components/editor/transform-markdown";
import { Heading } from "@/components/ui/heading";

interface ExportProjectProps extends MenuProps {
  project: IProject;
}

export function ExportProject({
  editor,
  project,
}: Readonly<ExportProjectProps>) {
  const handleCSV = () => {
    const markdown = serialize(
      editor.schema,
      editor.state.doc.toJSON() as JSONContent,
    );

    const csvContent = [
      "title, created_at, content",
      `${project.name}, ${format(new Date(project.created_at), "PPPp")}, ${markdown}`,
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name}.csv`;

    document.body.append(a);
    a.click();

    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleTXT = () => {
    const markdown = serialize(
      editor.schema,
      editor.state.doc.toJSON() as JSONContent,
    );

    const txtContent = [
      `${project.name}`,
      `${format(new Date(project.created_at), "PPPp")}`,
      `${markdown}`,
    ].join("\n");

    const blob = new Blob([txtContent], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name}.txt`;

    document.body.append(a);
    a.click();

    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleMD = () => {
    const markdown = serialize(
      editor.schema,
      editor.state.doc.toJSON() as JSONContent,
    );

    const mdContent = [
      `# ${project.name}`,
      `## ${format(new Date(project.created_at), "PPPp")}`,
      `${markdown}`,
    ].join("\n");

    const blob = new Blob([mdContent], {
      type: "text/markdown;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name}.md`;

    document.body.append(a);
    a.click();

    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-2">
      <div>
        <Heading level={5}>Download</Heading>
        <p className="text-sm text-muted-foreground">
          Export the project to different formats.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          className="bg-pdf text-pdf-foreground hover:opacity-80"
          disabled
        >
          <Icons.Pdf className="mr-2 size-4" /> PDF (Coming Soon)
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
