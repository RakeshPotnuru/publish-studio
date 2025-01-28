import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
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

interface TitleProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  isLoading: boolean;
  tooltipRef: RefObject<HTMLButtonElement>;
  projectId: IProject["_id"];
}

export function Title({
  form,
  isLoading,
  tooltipRef,
  projectId,
}: Readonly<TitleProps>) {
  const { mutateAsync: generateTitle, isLoading: isTitleGenerating } =
    trpc.genAI.generate.title.useMutation({
      onSuccess: ({ data }) => {
        form.setValue("title", data.title, { shouldDirty: true });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const handleGenerateTitle = async () => {
    try {
      await generateTitle({
        project_id: projectId,
      });
    } catch {
      // Ignore
    }
  };

  return (
    <FormField
      control={form.control}
      name="title"
      disabled={isLoading}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>Title</FormLabel>
          <div className="flex items-center space-x-1">
            <Tooltip content="Generate title">
              <ProButton
                ref={tooltipRef}
                type="button"
                onClick={handleGenerateTitle}
                size="icon"
                disabled={isTitleGenerating || isLoading}
                featuretext="generate SEO optimized title"
              >
                <ButtonLoader isLoading={isTitleGenerating} isIcon>
                  <Icons.Magic className="size-4" />
                </ButtonLoader>
              </ProButton>
            </Tooltip>
            <FormControl>
              <Input type="text" placeholder="Post title" {...field} />
            </FormControl>
          </div>
          {field.value && (
            <CharactersLengthViewer
              maxLength={constants.project.title.MAX_LENGTH}
              length={field.value.length}
              recommendedLength={{
                min: constants.project.title.RECOMMENDED_MIN_LENGTH,
                max: constants.project.title.RECOMMENDED_MAX_LENGTH,
              }}
            />
          )}
          <FormDescription>
            Recommended length is between{" "}
            {constants.project.title.RECOMMENDED_MIN_LENGTH}-
            {constants.project.title.RECOMMENDED_MAX_LENGTH} characters.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
