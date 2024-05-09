import { useState } from "react";

import { Button, toast } from "@itsrakesh/ui";
import type { IProject } from "@publish-studio/core";
import { format } from "date-fns";
import docx from "remark-docx";
import md from "remark-parse";
import pdf from "remark-pdf";
import { unified } from "unified";

import { Icons } from "@/assets/icons";
import type { MenuProps } from "@/components/editor/menu/fixed-menu";
import { Heading } from "@/components/ui/heading";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";

interface ExportProjectProps extends MenuProps {
  project: IProject;
}

const fetchImage = async (
  url: string,
): Promise<{ image: ArrayBuffer; width: number; height: number }> => {
  try {
    const image = new Image();
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();

    return new Promise((resolve, reject) => {
      image.addEventListener("load", () => {
        resolve({
          image: buffer,
          width: 500,
          height: 250,
        });
      });
      image.addEventListener("error", reject);
      image.src = URL.createObjectURL(
        new Blob([buffer], { type: "image/png" }),
      );
    });
  } catch (error) {
    console.error(error);
  }

  return {
    image: new ArrayBuffer(0),
    width: 0,
    height: 0,
  };
};

const pdfProcessor = unified()
  .use(md)
  .use(pdf, {
    output: "blob",
    imageResolver: fetchImage,
    watermark: {
      text: "Publish Studio",
      color: "#333",
      opacity: 0.1,
    },
  });

const docxProcessor = unified()
  .use(md)
  .use(docx, { output: "blob", imageResolver: fetchImage });

export function ExportProject({
  editor,
  project,
}: Readonly<ExportProjectProps>) {
  const [isPDFExporting, setIsPDFExporting] = useState(false);
  const [isDocxExporting, setIsDocxExporting] = useState(false);

  const handlePDF = async () => {
    try {
      setIsPDFExporting(true);
      const markdown = editor.storage.markdown.getMarkdown();

      const pdfContent = `
      ---
      Title: ${project.name}
      Created at: ${format(new Date(project.created_at), "PPPp")}
      ---

      ${markdown}
    `;

      const doc = await pdfProcessor.process(pdfContent);
      const blob = (await doc.result) as Blob;
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${project.name}.pdf`;

      document.body.append(a);
      a.click();

      a.remove();
      URL.revokeObjectURL(url);

      setIsPDFExporting(false);
    } catch {
      toast.error("Failed to export project to PDF. Please try again.");
      setIsPDFExporting(false);
    }
  };

  const handleDocx = async () => {
    try {
      setIsDocxExporting(true);
      const markdown = editor.storage.markdown.getMarkdown();

      const docxContent = `
      ---
      Title: ${project.name}\n
      Created at: ${format(new Date(project.created_at), "PPPp")}\n\n
      ---

      ${markdown}
    `;

      const doc = await docxProcessor.process(docxContent);
      const blob = (await doc.result) as Blob;
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${project.name}.docx`;

      document.body.append(a);
      a.click();

      a.remove();
      URL.revokeObjectURL(url);

      setIsDocxExporting(false);
    } catch {
      toast.error("Failed to export project to Docx. Please try again.");
      setIsDocxExporting(false);
    }
  };

  const handleCSV = () => {
    const markdown = editor.storage.markdown.getMarkdown();

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
    const markdown = editor.storage.markdown.getMarkdown();

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
    const markdown = editor.storage.markdown.getMarkdown();

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
          onClick={handlePDF}
          size="sm"
          className="bg-pdf text-pdf-foreground hover:opacity-80"
          disabled={isPDFExporting}
        >
          <ButtonLoader isLoading={isPDFExporting}>
            <Icons.Pdf className="mr-2 size-4" /> PDF
          </ButtonLoader>
        </Button>
        <Button
          onClick={handleDocx}
          size="sm"
          className="bg-docx text-docx-foreground hover:opacity-80"
          disabled={isDocxExporting}
        >
          <ButtonLoader isLoading={isDocxExporting}>
            <Icons.Docx className="mr-2 size-4" /> Docx
          </ButtonLoader>
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
