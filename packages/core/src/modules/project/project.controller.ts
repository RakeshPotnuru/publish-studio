import { TRPCError } from "@trpc/server";
import type { Message } from "amqplib";
import type { Types } from "mongoose";

import defaultConfig from "../../config/app.config";
import { constants } from "../../constants";
import type { Context } from "../../trpc";
import { rabbitMQConnection } from "../../utils/rabbitmq";
import ProjectHelpers from "./project.helpers";
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

        const publishResponse = await new ProjectHelpers().publishOnPlatforms(
            project,
            user_id,
            hashnode_tags,
        );

        await super.updateProjectById(project_id, {
            platforms: publishResponse,
            status:
                publishResponse.length > 0 &&
                publishResponse.every(platform => platform.status === "success")
                    ? constants.project.status.PUBLISHED
                    : constants.project.status.DRAFT,
        });

        return {
            status: "success",
            data: {
                publishResponse: publishResponse,
            },
        };
    }

    async updatePostHandler(
        input: {
            project_id: Types.ObjectId;
            platforms: {
                name: (typeof constants.user.platforms)[keyof typeof constants.user.platforms];
            }[];
            hashnode_tags?: hashnode_tags;
        },
        ctx: Context,
    ) {
        const project = await super.getProjectById(input.project_id);

        const updateResponse = await new ProjectHelpers().updateOnPlatforms(
            project,
            ctx.user?._id,
            input.hashnode_tags,
        );

        if (!updateResponse) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Project is not published.",
            });
        }

        await super.updateProjectById(input.project_id, {
            platforms: updateResponse,
            status:
                updateResponse.length > 0 &&
                updateResponse.every(platform => platform.status === "success")
                    ? constants.project.status.PUBLISHED
                    : constants.project.status.DRAFT,
        });

        return {
            status: "success",
            data: {
                updateResponse: updateResponse,
            },
        };
    }

    async postReceiver() {
        try {
            const connection = await rabbitMQConnection();

            if (connection) {
                const channel = await connection.createChannel();

                const queue = constants.rabbitmq.queues.POSTS;

                await channel.assertQueue(queue, {
                    durable: true,
                });
                await channel.prefetch(1);

                console.log(`🐇 Waiting for requests in ${queue} queue.`);

                await channel.consume(queue, message => {
                    if (!message) {
                        return;
                    }

                    const data = JSON.parse(message?.content.toString());

                    this.publishPost(
                        data.project_id as Types.ObjectId,
                        data.user_id as Types.ObjectId,
                        data.hashnode_tags as hashnode_tags,
                    ).catch(error => {
                        console.log(error);
                    });

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
                name: (typeof constants.user.platforms)[keyof typeof constants.user.platforms];
            }[];
            hashnode_tags?: hashnode_tags;
            scheduled_at: Date;
        },
        ctx: Context,
    ) {
        try {
            const { project_id, platforms, hashnode_tags, scheduled_at } = input;

            const project = await super.getProjectById(project_id);

            if (project.status === constants.project.status.PUBLISHED) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Project is already published.",
                });
            }

            await super.updateProjectById(project_id, {
                platforms: platforms,
                status: constants.project.status.SCHEDULED,
                scheduled_at: scheduled_at,
            });

            const connection = await rabbitMQConnection();

            if (connection) {
                const channel = await connection.createChannel();

                const queue = constants.rabbitmq.queues.POST_JOBS;

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
