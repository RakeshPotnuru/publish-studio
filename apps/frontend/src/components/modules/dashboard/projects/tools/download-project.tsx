import { Icons } from "@/assets/icons";
import { MenuProps } from "@/components/modules/dashboard/projects/editor/menu/fixed-menu";
import { Heading } from "@/components/ui/heading";
import { Button } from "@itsrakesh/ui";

export function DownloadProject({ editor }: MenuProps) {
    return (
        <div className="space-y-2">
            <div>
                <Heading level={5}>Download</Heading>
                <p className="text-muted-foreground text-sm">
                    Download the project in a variety of formats.
                </p>
            </div>
            <div className="flex flex-wrap gap-2">
                <Button size="sm" className="bg-pdf text-pdf-foreground hover:opacity-80">
                    <Icons.Pdf className="mr-2 h-4 w-4" /> PDF
                </Button>
                <Button size="sm" className="bg-csv text-csv-foreground hover:opacity-80">
                    <Icons.Csv className="mr-2 h-4 w-4" /> CSV
                </Button>
                <Button size="sm" className="bg-txt text-txt-foreground hover:opacity-80">
                    <Icons.Txt className="mr-2 h-4 w-4" /> TXT
                </Button>
                <Button size="sm" className="bg-markdown text-markdown-foreground hover:opacity-80">
                    <Icons.Markdown className="mr-2 h-4 w-4" /> MD
                </Button>
            </div>
        </div>
    );
}
