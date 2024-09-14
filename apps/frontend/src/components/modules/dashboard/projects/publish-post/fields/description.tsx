import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Textarea,
  toast,
} from "@itsrakesh/ui";
import type { IProject } from "@publish-studio/core";
import { constants } from "@publish-studio/core/src/config/constants";
import type { RefObject } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";

import { Icons } from "@/assets/icons";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { ProButton } from "@/components/ui/pro-button";
import { Tooltip } from "@/components/ui/tooltip";
import { trpc } from "@/utils/trpc";

import { CharactersLengthViewer } from "../characters-length-viewer";
import type { formSchema } from "../form-schema";

interface DescriptionProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  isLoading: boolean;
  tooltipRef: RefObject<HTMLButtonElement>;
  projectId: IProject["_id"];
}

export function Description({
  form,
  isLoading,
  tooltipRef,
  projectId,
}: Readonly<DescriptionProps>) {
  const {
    mutateAsync: generateDescription,
    isLoading: isDescriptionGenerating,
  } = trpc.genAI.generate.description.useMutation({
    onSuccess: ({ data }) => {
      form.setValue("description", data.description, { shouldDirty: true });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleGenerateDescription = async () => {
    try {
      await generateDescription({
        project_id: projectId,
      });
    } catch {
      // Ignore
    }
  };

  return (
    <FormField
      control={form.control}
      name="description"
      disabled={isLoading}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>Description</FormLabel>
          <div className="flex items-start space-x-1">
            <Tooltip content="Generate description">
              <ProButton
                ref={tooltipRef}
                type="button"
                onClick={handleGenerateDescription}
                size="icon"
                disabled={isDescriptionGenerating || isLoading}
                featuretext="generate SEO optimized description"
              >
                <ButtonLoader isLoading={isDescriptionGenerating} isIcon>
                  <Icons.Magic className="size-4" />
                </ButtonLoader>
              </ProButton>
            </Tooltip>
            <FormControl>
              <Textarea placeholder="Post description" {...field} />
            </FormControl>
          </div>
          {field.value && (
            <CharactersLengthViewer
              maxLength={constants.project.description.MAX_LENGTH}
              length={field.value.length}
              recommendedLength={{
                min: constants.project.description.RECOMMENDED_MIN_LENGTH,
                max: constants.project.description.RECOMMENDED_MAX_LENGTH,
              }}
            />
          )}
          <FormDescription>
            Recommended length is between{" "}
            {constants.project.description.RECOMMENDED_MIN_LENGTH}-
            {constants.project.description.RECOMMENDED_MAX_LENGTH} characters.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
