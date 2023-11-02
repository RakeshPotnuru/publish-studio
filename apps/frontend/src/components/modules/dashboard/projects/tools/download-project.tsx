import { Icons } from "@/assets/icons";
import { MenuProps } from "@/components/editor/menu/fixed-menu";
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
                    <Icons.pdf className="mr-2 h-4 w-4" /> PDF
                </Button>
                <Button size="sm" className="bg-csv text-csv-foreground hover:opacity-80">
                    <Icons.csv className="mr-2 h-4 w-4" /> CSV
                </Button>
                <Button size="sm" className="bg-txt text-txt-foreground hover:opacity-80">
                    <Icons.txt className="mr-2 h-4 w-4" /> TXT
                </Button>
                <Button size="sm" className="bg-md text-md-foreground hover:opacity-80">
                    <Icons.markdown className="mr-2 h-4 w-4" /> MD
                </Button>
            </div>
        </div>
    );
}
