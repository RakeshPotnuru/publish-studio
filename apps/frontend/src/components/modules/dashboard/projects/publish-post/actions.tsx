import { Button, toast } from "@itsrakesh/ui";
import type { IProject, IUser } from "@publish-studio/core";
import { ProjectStatus } from "@publish-studio/core/src/config/constants";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";

import { Icons } from "@/assets/icons";
import { ButtonLoader } from "@/components/ui/loaders/button-loader";
import { ProButton } from "@/components/ui/pro-button";
import { Tooltip } from "@/components/ui/tooltip";
import { trpc } from "@/utils/trpc";

import type { formSchema } from "./form-schema";
import { SchedulePost } from "./schedule-post";

interface ActionsProps {
    form: UseFormReturn<z.infer<typeof formSchema>>;
    isLoading: boolean;
    project: IProject;
    handleSave: (data: z.infer<typeof formSchema>) => Promise<void>;
    isProjectSaving: boolean;
    isPostPublishing: boolean;
    handleRefresh: () => Promise<void>;
    publishPost: (
        data: z.infer<typeof formSchema> & { project_id: IProject["_id"]; scheduled_at?: Date },
    ) => Promise<{ status: string; data: { message: string } }>;
    user: IUser;
    setIsPostUpdating: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Actions({
    form,
    isLoading,
    project,
    handleRefresh,
    handleSave,
    isPostPublishing,
    isProjectSaving,
    publishPost,
    user,
    setIsPostUpdating,
}: Readonly<ActionsProps>) {
    const { mutateAsync: updatePost, isLoading: isPostUpdating } = trpc.post.edit.useMutation({
        onSuccess: async ({ data }) => {
            toast.success(data.message);
            await handleRefresh();
        },
        onError: error => {
            toast.error(error.message);
        },
    });

    const handleSchedule = async (data: z.infer<typeof formSchema>, date: Date) => {
        try {
            await handleSave(data);

            await publishPost({
                ...data,
                project_id: project._id,
                scheduled_at: date,
            });
        } catch {
            // Ignore
        }
    };

    const handleUpdate = async (data: z.infer<typeof formSchema>) => {
        try {
            setIsPostUpdating(true);
            await handleSave(data);

            await updatePost({
                ...data,
                project_id: project._id,
            });
            setIsPostUpdating(false);
        } catch {
            // Ignore
        }
        setIsPostUpdating(false);
    };

    const watchPlatforms = form.watch("platforms") ?? [];

    return (
        <>
            <Tooltip content="Save changes">
                <Button
                    onClick={form.handleSubmit(handleSave)}
                    type="button"
                    variant="info"
                    size="icon"
                    disabled={!form.formState.isDirty || isLoading}
                >
                    <ButtonLoader isLoading={isProjectSaving} isIcon>
                        <Icons.Save className="size-4" />
                    </ButtonLoader>
                </Button>
            </Tooltip>
            {project.status === ProjectStatus.PUBLISHED && (
                <ProButton
                    onClick={form.handleSubmit(handleUpdate)}
                    type="button"
                    disabled={isLoading || project.updated_at === project.published_at}
                    featureText="update published post in a single click"
                >
                    <ButtonLoader isLoading={isPostUpdating}>Update Post</ButtonLoader>
                </ProButton>
            )}
            {/* Hide when post is published to all user connected platforms */}
            {user.platforms?.length !== project.platforms?.length && (
                <Button
                    type="submit"
                    disabled={
                        !form.formState.isDirty ||
                        isLoading ||
                        project.status === ProjectStatus.SCHEDULED ||
                        watchPlatforms.length === 0
                    }
                >
                    <ButtonLoader isLoading={isPostPublishing}>Publish Now</ButtonLoader>
                </Button>
            )}
            {project.status !== ProjectStatus.PUBLISHED && (
                <SchedulePost
                    onConfirm={async date => {
                        await handleSchedule(form.getValues(), date);
                    }}
                >
                    <Button
                        type="button"
                        variant="secondary"
                        disabled={
                            !form.formState.isDirty ||
                            isLoading ||
                            project.status === ProjectStatus.SCHEDULED ||
                            watchPlatforms.length === 0
                        }
                    >
                        <ButtonLoader isLoading={isPostPublishing}>
                            Schedule <Icons.Schedule className="ml-2 size-4" />
                        </ButtonLoader>
                    </Button>
                </SchedulePost>
            )}
        </>
    );
}
