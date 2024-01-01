import { TRPCError } from "@trpc/server";
import type { Job } from "bullmq";
import { Queue, Worker } from "bullmq";
import { Types } from "mongoose";

import { bullMQConnectionOptions } from "../../config/app.config";
import { constants } from "../../config/constants";
import DevToController from "../platform/devto/devto.controller";
import GhostController from "../platform/ghost/ghost.controller";
import HashnodeController from "../platform/hashnode/hashnode.controller";
import MediumController from "../platform/medium/medium.controller";
import type { TPlatformName } from "../platform/platform.types";
import WordPressController from "../platform/wordpress/wordpress.controller";
import ProjectController from "./project.controller";
import type { IPost, IProject, TPlatformPublishStatus } from "./project.types";

export interface IPublishResponse {
    name: TPlatformName;
    status: TPlatformPublishStatus;
    published_url?: string;
    id?: string;
}

export default class ProjectHelpers {
    static shouldPublishOnPlatform(project: IProject, targetPlatform: TPlatformName) {
        return (
            project.platforms?.find(platform => platform.name === targetPlatform) &&
            project.platforms.find(platform => platform.name === targetPlatform)?.status !==
                constants.project.platformPublishStatuses.SUCCESS
        );
    }

    static shouldUpdateOnPlatform(project: IProject, targetPlatform: TPlatformName) {
        return (
            project.platforms?.find(platform => platform.name === targetPlatform) &&
            project.platforms.find(platform => platform.name === targetPlatform)?.status ===
                constants.project.platformPublishStatuses.SUCCESS
        );
    }

    static updatePlatformStatus(
        updateResponse: IProject["platforms"],
        targetPlatform: TPlatformName,
        status: TPlatformPublishStatus,
    ) {
        const platform = updateResponse?.find(platform => platform.name === targetPlatform);

        if (platform) {
            platform.status = status;
        }
    }

    static getPlatformCreateController(
        platform: TPlatformName,
    ):
        | DevToController
        | HashnodeController
        | MediumController
        | GhostController
        | WordPressController
        | undefined {
        switch (platform) {
            case constants.user.platforms.DEVTO: {
                return new DevToController();
            }
            case constants.user.platforms.HASHNODE: {
                return new HashnodeController();
            }
            case constants.user.platforms.MEDIUM: {
                return new MediumController();
            }
            case constants.user.platforms.GHOST: {
                return new GhostController();
            }
            case constants.user.platforms.WORDPRESS: {
                return new WordPressController();
            }

            default: {
                return;
            }
        }
    }

    static getPlatformUpdateController(
        platform: TPlatformName,
    ): DevToController | HashnodeController | GhostController | WordPressController | undefined {
        switch (platform) {
            case constants.user.platforms.DEVTO: {
                return new DevToController();
            }
            case constants.user.platforms.HASHNODE: {
                return new HashnodeController();
            }
            case constants.user.platforms.GHOST: {
                return new GhostController();
            }
            case constants.user.platforms.WORDPRESS: {
                return new WordPressController();
            }

            default: {
                return;
            }
        }
    }

    async publishOnPlatform(platform: TPlatformName, project: IProject, user_id: Types.ObjectId) {
        const controller = ProjectHelpers.getPlatformCreateController(platform);

        if (!controller) {
            return {} as IPublishResponse;
        }

        return await controller.createPostHandler({ post: project }, user_id);
    }

    async publishOnPlatforms(project: IProject, user_id: Types.ObjectId) {
        const publishResponse = [] as IPublishResponse[];

        if (ProjectHelpers.shouldPublishOnPlatform(project, constants.user.platforms.HASHNODE)) {
            const response = await this.publishOnPlatform(
                constants.user.platforms.HASHNODE,
                project,
                user_id,
            );

            publishResponse.push(response);
        }

        if (ProjectHelpers.shouldPublishOnPlatform(project, constants.user.platforms.DEVTO)) {
            const response = await this.publishOnPlatform(
                constants.user.platforms.DEVTO,
                project,
                user_id,
            );

            publishResponse.push(response);
        }

        if (ProjectHelpers.shouldPublishOnPlatform(project, constants.user.platforms.MEDIUM)) {
            const response = await this.publishOnPlatform(
                constants.user.platforms.MEDIUM,
                project,
                user_id,
            );

            publishResponse.push(response);
        }

        if (ProjectHelpers.shouldPublishOnPlatform(project, constants.user.platforms.GHOST)) {
            const response = await this.publishOnPlatform(
                constants.user.platforms.GHOST,
                project,
                user_id,
            );

            publishResponse.push(response);
        }

        if (ProjectHelpers.shouldPublishOnPlatform(project, constants.user.platforms.WORDPRESS)) {
            const response = await this.publishOnPlatform(
                constants.user.platforms.WORDPRESS,
                project,
                user_id,
            );

            publishResponse.push(response);
        }

        return publishResponse;
    }

    async updateOnPlatform(
        targetPlatform: TPlatformName,
        project: IProject,
        user_id: Types.ObjectId | undefined,
    ) {
        const post_id = project.platforms?.find(platform => platform.name === targetPlatform)?.id;

        if (!post_id) {
            return;
        }

        const controller = ProjectHelpers.getPlatformUpdateController(targetPlatform);

        if (!controller) {
            return;
        }

        const response = await controller.updatePostHandler({ post: project, post_id }, user_id);

        ProjectHelpers.updatePlatformStatus(
            project.platforms,
            targetPlatform,
            response.data.post.isError
                ? constants.project.platformPublishStatuses.ERROR
                : constants.project.platformPublishStatuses.SUCCESS,
        );
    }

    async updateOnPlatforms(project: IProject, user_id: Types.ObjectId | undefined) {
        const updateResponse = project.platforms;

        if (!updateResponse) {
            return;
        }

        if (ProjectHelpers.shouldUpdateOnPlatform(project, constants.user.platforms.DEVTO)) {
            await this.updateOnPlatform(constants.user.platforms.DEVTO, project, user_id);
        }

        if (ProjectHelpers.shouldUpdateOnPlatform(project, constants.user.platforms.HASHNODE)) {
            await this.updateOnPlatform(constants.user.platforms.HASHNODE, project, user_id);
        }

        if (ProjectHelpers.shouldUpdateOnPlatform(project, constants.user.platforms.GHOST)) {
            await this.updateOnPlatform(constants.user.platforms.GHOST, project, user_id);
        }

        if (ProjectHelpers.shouldUpdateOnPlatform(project, constants.user.platforms.WORDPRESS)) {
            await this.updateOnPlatform(constants.user.platforms.WORDPRESS, project, user_id);
        }

        return updateResponse;
    }

    async schedulePost(data: IPost) {
        try {
            const postQueue = new Queue(constants.bullmq.queues.POST, {
                connection: bullMQConnectionOptions,
            });

            const delay = Number(new Date(data.scheduled_at)) - Date.now();
            console.log(`⏰ Sending post in ${delay}ms`);

            await postQueue.add(
                `${constants.bullmq.queues.POST}-job-${data.project_id.toString()}`,
                data,
                {
                    delay,
                },
            );

            this.startSchedulePostWorker();
        } catch (error) {
            console.log("❌ Failed to schedule post");

            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to schedule post. Please try again later.",
            });
        }
    }

    startSchedulePostWorker() {
        try {
            const worker = new Worker<IPost, IPost>(
                constants.bullmq.queues.POST,
                async (job: Job) => {
                    await new ProjectController().publishPost(
                        new Types.ObjectId(job.data.project_id as string),
                        new Types.ObjectId(job.data.user_id as string),
                    );

                    console.log(
                        `✅ Sent post ${job.id ?? ""} at ${job.data.scheduled_at as string}`,
                    );
                    return job.data as IPost;
                },
                { connection: bullMQConnectionOptions },
            );

            worker.on("completed", job => {
                void job.remove();
                console.log(`✅ Completed scheduled post ${job.id ?? ""}`);
            });

            worker.on("failed", job => {
                console.log(job?.failedReason);

                console.log("❌ Job Failed");
            });

            worker.on("error", error => {
                console.log(error);
            });
        } catch (error) {
            console.log("❌ Failed to start schedule post worker");

            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to schedule post. Please try again later.",
            });
        }
    }
}
