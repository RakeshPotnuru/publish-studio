import { zodResolver } from "@hookform/resolvers/zod";
import {
    Button,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    toast,
} from "@itsrakesh/ui";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Icons } from "@/assets/icons";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { ProButton } from "@/components/ui/pro-button";
import { Tooltip } from "@/components/ui/tooltip";
import { trpc } from "@/utils/trpc";
import type { ProjectSettingsProps } from ".";

interface UpdateCategoriesProps extends ProjectSettingsProps {}

const formSchema = z.object({
    categories: z.string(),
});

export function UpdateCategories({ project }: UpdateCategoriesProps) {
    const tooltipRef = useRef<HTMLButtonElement>(null);
    const utils = trpc.useUtils();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categories: project.categories?.join(","),
        },
    });

    const { mutateAsync: updateCategories, isLoading: isUpdating } =
        trpc.projects.update.useMutation({
            onSuccess: () => {
                toast.success("Categories updated successfully");
                utils.projects.getById.invalidate();
            },
            onError: error => {
                toast.error(error.message);
            },
        });

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            await updateCategories({
                id: project._id,
                project: {
                    categories: data.categories.split(","),
                },
            });
        } catch (error) {}
    };

    const { mutateAsync: generateCategories, isLoading: isGenerating } =
        trpc.genAI.generate.categories.useMutation({
            onSuccess: ({ data }) => {
                form.setValue("categories", data.categories.join(","), { shouldDirty: true });
            },
            onError: error => {
                toast.error(error.message);
            },
        });

    const handleGenerateCategories = async () => {
        try {
            await generateCategories({
                text: project.title ?? project.name,
            });
        } catch (error) {}
    };

    const isLoading = form.formState.isSubmitting || isUpdating || isGenerating;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <FormField
                    control={form.control}
                    name="categories"
                    disabled={isLoading}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Change categories</FormLabel>
                            <div className="flex items-center space-x-1">
                                <Tooltip content="Generate categories">
                                    <ProButton
                                        ref={tooltipRef}
                                        type="button"
                                        onClick={handleGenerateCategories}
                                        size="icon"
                                        disabled={isLoading}
                                        featureText="assign categories"
                                    >
                                        <ButtonLoader isLoading={isGenerating} isIcon>
                                            <Icons.Magic className="size-4" />
                                        </ButtonLoader>
                                    </ProButton>
                                </Tooltip>
                                <FormControl>
                                    <Input placeholder="category1,category2,..." {...field} />
                                </FormControl>
                                <Tooltip content="Save changes">
                                    <Button
                                        type="submit"
                                        variant="info"
                                        size="icon"
                                        disabled={!form.formState.isDirty || isLoading}
                                    >
                                        <ButtonLoader isLoading={isUpdating} isIcon>
                                            <Icons.Save className="size-4" />
                                        </ButtonLoader>
                                    </Button>
                                </Tooltip>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}