import { TRPCError } from "@trpc/server";
import type { Message } from "amqplib";
import type { Types } from "mongoose";

import defaultConfig from "../../config/app.config";
import { rabbitmq, user } from "../../constants";
import type { Context } from "../../trpc";
import { rabbitMQConnection } from "../../utils/rabbitmq";
import DevToController from "../platform/devto/devto.controller";
import HashnodeController from "../platform/hashnode/hashnode.controller";
import MediumController from "../platform/medium/medium.controller";
import ProjectService from "./project.service";
import type { hashnode_tags, IProject, IProjectUpdate } from "./project.types";

export default class ProjectController extends ProjectService {
    async createProjectHandler(input: { project: IProject }, ctx: Context) {
        const { project } = input;

        if (project.folder_id) {
            const folder = await super.getFolderById(project.folder_id);

            if (!folder) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Folder not found.",
                });
            }
        }

        const newProject = await super.createProject({
            user_id: ctx.user?._id,
            folder_id: project.folder_id,
            title: project.title,
            description: project.description,
            body: project.body,
            tags: project.tags,
            status: project.status,
            cover_image: project.cover_image,
            scheduled_at: project.scheduled_at,
        });

        return {
            success: true,
            data: {
                project: newProject,
            },
        };
    }

    private async publishPost(
        project_id: Types.ObjectId,
        user_id: Types.ObjectId,
        hashnode_tags?: hashnode_tags,
    ) {
        const project = await super.getProjectById(project_id);

        const publishResponse = [] as {
            name: (typeof user.platforms)[keyof typeof user.platforms];
            status: "success" | "error";
            published_url: string;
        }[];

        const platforms = project.platforms?.map(platform => platform.name) ?? [];

        if (platforms.includes(user.platforms.DEVTO)) {
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

        if (platforms.includes(user.platforms.HASHNODE)) {
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

        if (platforms.includes(user.platforms.MEDIUM)) {
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

        await super.updateProjectById(project_id, {
            platforms: publishResponse,
        });

        return {
            status: "success",
            data: {
                publishResponse: publishResponse,
            },
        };
    }

    async postReceiver() {
        try {
            const connection = await rabbitMQConnection();

            if (connection) {
                const channel = await connection.createChannel();

                const queue = rabbitmq.queues.POSTS;

                await channel.assertQueue(queue, {
                    durable: true,
                });
                await channel.prefetch(1);

                console.log(`🐇 Waiting for requests in ${queue} queue.`);

                await channel.consume(queue, async message => {
                    if (!message) {
                        return;
                    }

                    const data = JSON.parse(message?.content.toString());

                    await this.publishPost(
                        data.project_id as Types.ObjectId,
                        data.user_id as Types.ObjectId,
                        data.hashnode_tags as hashnode_tags,
                    );

                    channel.sendToQueue(
                        message?.properties.replyTo as string,
                        Buffer.from(
                            JSON.stringify({
                                status: "success",
                                job: "post",
                            }),
                        ),
                        {
                            correlationId: message?.properties.correlationId as string,
                        },
                    );

                    channel.ack(message as Message);
                });
            } else {
                console.log("❌ Failed to connect to RabbitMQ 🐇");
            }
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }

    async schedulePostHandler(
        input: {
            project_id: Types.ObjectId;
            platforms: {
                name: (typeof user.platforms)[keyof typeof user.platforms];
            }[];
            hashnode_tags?: hashnode_tags;
            scheduled_at: Date;
        },
        ctx: Context,
    ) {
        try {
            const { project_id, platforms, hashnode_tags, scheduled_at } = input;

            await super.updateProjectById(project_id, {
                platforms: platforms,
                scheduled_at: scheduled_at,
            });

            const connection = await rabbitMQConnection();

            if (connection) {
                const channel = await connection.createChannel();

                const queue = rabbitmq.queues.POSTS;

                await channel.assertQueue(queue, {
                    durable: true,
                });

                channel.sendToQueue(
                    queue,
                    Buffer.from(
                        JSON.stringify({
                            project_id: project_id,
                            hashnode_tags: hashnode_tags,
                            scheduled_at: scheduled_at,
                            user_id: ctx.user?._id,
                        }),
                    ),
                );

                return {
                    status: "success",
                    data: {
                        message: "Post scheduled successfully",
                    },
                };
            } else {
                console.log("❌ Failed to connect to RabbitMQ 🐇");

                return {
                    status: "error",
                };
            }
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to schedule post. Please try again later.",
            });
        }
    }

    async getProjectHandler(input: { id: Types.ObjectId }) {
        const project = await super.getProjectById(input.id);

        if (!project) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Project not found",
            });
        }

        return {
            status: "success",
            data: {
                project: project,
            },
        };
    }

    async getAllProjectsHandler(ctx: Context) {
        const projects = await super.getProjectsByUserId(ctx.user?._id);

        return {
            status: "success",
            data: {
                projects: projects,
            },
        };
    }

    async updateProjectHandler(input: { id: Types.ObjectId; project: IProjectUpdate }) {
        const project = await super.getProjectById(input.id);

        if (!project) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Project not found",
            });
        }

        const updatedProject = await super.updateProjectById(input.id, input.project);

        return {
            status: "success",
            data: {
                project: updatedProject,
            },
        };
    }

    async deleteProjectHandler(input: { id: Types.ObjectId }) {
        const project = await super.deleteProjectById(input.id);

        if (!project) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Project not found",
            });
        }

        return {
            status: "success",
            data: {
                project: project,
            },
        };
    }
}
