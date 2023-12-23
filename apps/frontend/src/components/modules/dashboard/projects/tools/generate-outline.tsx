import { useToast } from "@itsrakesh/ui";
import type { Types } from "mongoose";

import { Icons } from "@/assets/icons";
import { Heading } from "@/components/ui/heading";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { MagicButton } from "@/components/ui/magic-button";
import { trpc } from "@/utils/trpc";
import type { MenuProps } from "../editor/menu/fixed-menu";
import { deserialize } from "../editor/transform-markdown";

interface GenerateOutlineProps extends MenuProps {
    project_id: Types.ObjectId;
}

export function GenerateOutline({ editor, project_id }: GenerateOutlineProps) {
    const { toast } = useToast();

    const { mutateAsync: generateOutline, isLoading } = trpc.generateOutline.useMutation({
        onSuccess: ({ data }) => {
            toast({
                variant: "success",
                title: "Success",
                description: "Outline generated successfully.",
            });
            const deserialized = deserialize(editor.schema, data.outline);
            editor.commands.insertContentAt(0, deserialized);
        },
        onError: error => {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
            });
        },
    });

    const handleGenerateOutline = async () => {
        try {
            await generateOutline({
                project_id,
            });
        } catch (error) {}
    };

    return (
        <div className="space-y-2">
            <div>
                <Heading level={5}>Generate Outline</Heading>
                <p className="text-muted-foreground text-sm">
                    Quickly generate an outline of your topic.
                </p>
            </div>
            <MagicButton onClick={handleGenerateOutline} className="w-full" disabled={isLoading}>
                <ButtonLoader isLoading={isLoading}>
                    <Icons.Magic className="mr-2 size-4" /> Generate Outline
                </ButtonLoader>
            </MagicButton>
        </div>
    );
}
