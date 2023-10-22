import type { Types } from "mongoose";

import { constants } from "../../constants";
import DevToController from "../platform/devto/devto.controller";
import HashnodeController from "../platform/hashnode/hashnode.controller";
import MediumController from "../platform/medium/medium.controller";
import type { IProject, TTags } from "./project.types";

export default class ProjectHelpers {
    static shouldPublishOnPlatform(
        project: IProject,
        targetPlatform: (typeof constants.user.platforms)[keyof typeof constants.user.platforms],
    ) {
        return (
            project.platforms?.find(platform => platform.name === targetPlatform) &&
            project.platforms.find(platform => platform.name === targetPlatform)?.status !==
                "success"
        );
    }

    async publishOnPlatforms(project: IProject, user_id: Types.ObjectId, tags: TTags) {
        const publishResponse = [] as {
            name: (typeof constants.user.platforms)[keyof typeof constants.user.platforms];
            status: "success" | "error";
            published_url: string;
            id: string;
        }[];

        if (ProjectHelpers.shouldPublishOnPlatform(project, constants.user.platforms.DEVTO)) {
            const response = await new DevToController().createPostHandler(
                {
                    post: project,
                    tags: tags,
                },
                user_id,
            );

            publishResponse.push({
                name: constants.user.platforms.DEVTO,
                status: response.data.post.error ? "error" : "success",
                published_url: response.data.post.url,
                id: response.data.post.id.toString(),
            });
        }

        if (ProjectHelpers.shouldPublishOnPlatform(project, constants.user.platforms.HASHNODE)) {
            const hashnodeUser = await new HashnodeController().getPlatformById(user_id);
            const response = await new HashnodeController().createPostHandler(
                {
                    post: project,
                    tags: tags,
                },
                user_id,
            );

            const blogHandle = hashnodeUser?.blog_handle ?? "unknown";
            const postSlug = response.data.post.data.createStory.post.slug ?? "unknown";

            publishResponse.push({
                name: constants.user.platforms.HASHNODE,
                status: response.data.post?.errors ? "error" : "success",
                published_url: `https://${blogHandle}.hashnode.dev/${postSlug}`,
                id: response.data.post.data.createStory.post._id,
            });
        }

        if (ProjectHelpers.shouldPublishOnPlatform(project, constants.user.platforms.MEDIUM)) {
            const response = await new MediumController().createPostHandler(
                {
                    post: project,
                    tags: tags,
                },
                user_id,
            );

            publishResponse.push({
                name: constants.user.platforms.MEDIUM,
                status: response.data.post.errors ? "error" : "success",
                published_url: response.data.post.data.url,
                id: response.data.post.data.id,
            });
        }

        return publishResponse;
    }

    static updatePlatformStatus(
        updateResponse: IProject["platforms"],
        targetPlatform: (typeof constants.user.platforms)[keyof typeof constants.user.platforms],
        status: "success" | "error",
    ) {
        const platform = updateResponse?.find(platform => platform.name === targetPlatform);

        if (platform) {
            platform.status = status;
        }
    }

    async updateOnPlatforms(project: IProject, user_id: Types.ObjectId | undefined, tags: TTags) {
        const updateResponse = project.platforms;

        if (!updateResponse) {
            return;
        }

        if (project.platforms?.find(platform => platform.name === constants.user.platforms.DEVTO)) {
            const post_id = project.platforms?.find(
                platform => platform.name === constants.user.platforms.DEVTO,
            )?.id;

            if (!post_id) {
                return;
            }

            const response = await new DevToController().updatePostHandler(
                {
                    post: project,
                    post_id: Number.parseInt(post_id),
                    tags: tags,
                },
                user_id,
            );

            ProjectHelpers.updatePlatformStatus(
                updateResponse,
                constants.user.platforms.DEVTO,
                response.data.post.error ? "error" : "success",
            );
        }

        if (
            project.platforms?.find(platform => platform.name === constants.user.platforms.HASHNODE)
        ) {
            const post_id = project.platforms?.find(
                platform => platform.name === constants.user.platforms.HASHNODE,
            )?.id;

            if (!post_id) {
                return;
            }

            const response = await new HashnodeController().updatePostHandler(
                {
                    post: project,
                    tags: tags,
                    post_id,
                },
                user_id,
            );

            ProjectHelpers.updatePlatformStatus(
                updateResponse,
                constants.user.platforms.HASHNODE,
                response.data.post?.errors ? "error" : "success",
            );
        }

        return updateResponse;
    }
}
