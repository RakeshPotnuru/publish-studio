import type { Types } from "mongoose";

import { user } from "../../constants";
import DevToController from "../platform/devto/devto.controller";
import HashnodeController from "../platform/hashnode/hashnode.controller";
import MediumController from "../platform/medium/medium.controller";
import type { hashnode_tags, IProject } from "./project.types";

export default class ProjectHelpers {
    static shouldPublishOnPlatform(
        project: IProject,
        targetPlatform: (typeof user.platforms)[keyof typeof user.platforms],
    ) {
        return (
            project.platforms?.find(platform => platform.name === targetPlatform) &&
            project.platforms.find(platform => platform.name === targetPlatform)?.status !==
                "success"
        );
    }

    async publishOnPlatforms(
        project: IProject,
        user_id: Types.ObjectId,
        hashnode_tags?: hashnode_tags,
    ) {
        const publishResponse = [] as {
            name: (typeof user.platforms)[keyof typeof user.platforms];
            status: "success" | "error";
            published_url: string;
        }[];

        if (ProjectHelpers.shouldPublishOnPlatform(project, user.platforms.DEVTO)) {
            const response = await new DevToController().createPostHandler(
                {
                    post: project,
                },
                user_id,
            );

            publishResponse.push({
                name: user.platforms.DEVTO,
                status: response.data.post.error ? "error" : "success",
                published_url: response.data.post.url,
            });
        }

        if (ProjectHelpers.shouldPublishOnPlatform(project, user.platforms.HASHNODE)) {
            const hashnodeUser = await new HashnodeController().getPlatformById(user_id);
            const response = await new HashnodeController().createPostHandler(
                {
                    post: project,
                    hashnode_tags: hashnode_tags,
                },
                user_id,
            );

            const blogHandle = hashnodeUser?.blog_handle ?? "unknown";
            const postSlug = response.data.post.data.createStory.post.slug ?? "unknown";

            publishResponse.push({
                name: user.platforms.HASHNODE,
                status: response.data.post?.errors ? "error" : "success",
                published_url: `https://${blogHandle}.hashnode.dev/${postSlug}`,
            });
        }

        if (ProjectHelpers.shouldPublishOnPlatform(project, user.platforms.MEDIUM)) {
            const response = await new MediumController().createPostHandler(
                {
                    post: project,
                },
                user_id,
            );

            publishResponse.push({
                name: user.platforms.MEDIUM,
                status: response.data.post.errors ? "error" : "success",
                published_url: response.data.post.data.url,
            });
        }

        return publishResponse;
    }
}
