import { toast } from "@itsrakesh/ui";
import type { Types } from "mongoose";

import { Icons } from "@/assets/icons";
import { Heading } from "@/components/ui/heading";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { ProButton } from "@/components/ui/pro-button";
import { trpc } from "@/utils/trpc";

import type { MenuProps } from "../../../../editor/menu/fixed-menu";
import { deserialize } from "../../../../editor/transform-markdown";

interface GenerateOutlineProps extends MenuProps {
  project_id: Types.ObjectId;
}

export function GenerateOutline({
  editor,
  project_id,
}: Readonly<GenerateOutlineProps>) {
  const { mutateAsync: generateOutline, isLoading } =
    trpc.genAI.generate.outline.useMutation({
      onSuccess: ({ data }) => {
        toast.success("Outline generated successfully.");
        const deserialized = deserialize(editor.schema, data.outline);
        editor.commands.insertContentAt(0, deserialized);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const handleGenerateOutline = async () => {
    try {
      await generateOutline({
        project_id,
      });
    } catch {
      // Ignore
    }
  };

  return (
    <div className="space-y-2">
      <div>
        <Heading level={5}>Generate Outline</Heading>
        <p className="text-sm text-muted-foreground">
          Quickly generate an outline of your topic.
        </p>
      </div>
      <ProButton
        onClick={handleGenerateOutline}
        size="sm"
        className="w-full"
        disabled={isLoading}
        featureText="generate an outline of your topic"
      >
        <ButtonLoader isLoading={isLoading}>
          <Icons.Magic className="mr-2 size-4" /> Generate Outline
        </ButtonLoader>
      </ProButton>
    </div>
  );
}
