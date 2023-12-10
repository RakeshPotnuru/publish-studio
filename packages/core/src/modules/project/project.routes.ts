import type { Types } from "mongoose";
import { z } from "zod";

import { constants } from "../../config/constants";
import { proProtectedProcedure, protectedProcedure, router } from "../../trpc";
import ProjectController from "./project.controller";
import type { THashnodeTag } from "./project.types";

const projectRouter = router({
    createProject: protectedProcedure
        .input(
            z.object({
                folder_id: z.custom<Types.ObjectId>().optional(),
                title: z
                    .string()
                    .min(constants.project.title.MIN_LENGTH)
                    .max(constants.project.title.MAX_LENGTH),
                description: z.string().max(constants.project.description.MAX_LENGTH).optional(),
                body: z
                    .object({
                        json: z.custom<JSON>().optional(),
                        html: z.string().optional(),
                        markdown: z.string().optional(),
                    })
                    .optional(),
                status: z
                    .nativeEnum(constants.project.status)
                    .optional()
                    .default(constants.project.status.DRAFT),
                cover_image: z.string().optional(),
                scheduled_at: z.string().pipe(z.coerce.date()).optional(),
            }),
        )
        .mutation(({ input, ctx }) => new ProjectController().createProjectHandler(input, ctx)),

    schedulePost: protectedProcedure
        .input(
            z.object({
                project_id: z.custom<Types.ObjectId>(),
                platforms: z
                    .array(
                        z.object({
                            name: z.nativeEnum(constants.user.platforms),
                        }),
                    )
                    .min(1),
                tags: z
                    .object({
                        hashnode_tags: z
                            .array(z.custom<THashnodeTag>())
                            .max(constants.project.tags.hashnode.MAX_LENGTH)
                            .optional(),
                        devto_tags: z
                            .array(z.string())
                            .max(constants.project.tags.dev.MAX_LENGTH)
                            .optional(),
                        medium_tags: z
                            .array(z.string())
                            .max(constants.project.tags.medium.MAX_LENGTH)
                            .optional(),
                        ghost_tags: z
                            .array(z.object({ name: z.string() }))
                            .max(constants.project.tags.ghost.MAX_LENGTH)
                            .optional(),
                    })
                    .optional(),
                scheduled_at: z.string().pipe(z.coerce.date()),
            }),
        )
        .mutation(({ input, ctx }) => new ProjectController().schedulePostHandler(input, ctx)),

    updatePost: proProtectedProcedure
        .input(
            z.object({
                project_id: z.custom<Types.ObjectId>(),
                platforms: z
                    .array(
                        z.object({
                            name: z.nativeEnum(constants.user.platforms),
                        }),
                    )
                    .min(1),
                tags: z.object({
                    hashnode_tags: z
                        .array(z.custom<THashnodeTag>())
                        .max(constants.project.tags.hashnode.MAX_LENGTH)
                        .optional(),
                    devto_tags: z
                        .array(z.string())
                        .max(constants.project.tags.dev.MAX_LENGTH)
                        .optional(),
                    medium_tags: z
                        .array(z.string())
                        .max(constants.project.tags.medium.MAX_LENGTH)
                        .optional(),
                    ghost_tags: z
                        .array(z.object({ name: z.string() }))
                        .max(constants.project.tags.ghost.MAX_LENGTH)
                        .optional(),
                }),
            }),
        )
        .mutation(({ input, ctx }) => new ProjectController().updatePostHandler(input, ctx)),

    getAllProjects: protectedProcedure
        .input(
            z.object({
                pagination: z.object({
                    page: z.number().min(1).default(1),
                    limit: z.number().min(1).default(10),
                }),
            }),
        )
        .query(({ input, ctx }) => new ProjectController().getAllProjectsHandler(input, ctx)),

    getProjectsByFolderId: protectedProcedure
        .input(
            z.object({
                folder_id: z.custom<Types.ObjectId>(),
                pagination: z.object({
                    page: z.number().min(1).default(1),
                    limit: z.number().min(1).default(10),
                }),
            }),
        )
        .query(({ input, ctx }) =>
            new ProjectController().getProjectsByFolderIdHandler(input, ctx),
        ),

    updateProject: protectedProcedure
        .input(
            z.object({
                id: z.custom<Types.ObjectId>(),
                project: z.object({
                    folder_id: z.custom<Types.ObjectId>().optional(),
                    title: z
                        .string()
                        .min(constants.project.title.MIN_LENGTH)
                        .max(constants.project.title.MAX_LENGTH)
                        .optional(),
                    description: z
                        .string()
                        .max(constants.project.description.MAX_LENGTH)
                        .optional(),
                    body: z
                        .object({
                            json: z.custom<JSON>().optional(),
                            html: z.string().optional(),
                            markdown: z.string().optional(),
                        })
                        .optional(),
                    status: z.nativeEnum(constants.project.status).optional(),
                    cover_image: z.string().optional(),
                    platforms: z
                        .array(
                            z.object({
                                name: z.nativeEnum(constants.user.platforms),
                                published_url: z.string().optional(),
                            }),
                        )
                        .optional(),
                    scheduled_at: z.string().pipe(z.coerce.date()).optional(),
                }),
            }),
        )
        .mutation(({ input, ctx }) => new ProjectController().updateProjectHandler(input, ctx)),

    deleteProjects: protectedProcedure
        .input(z.array(z.custom<Types.ObjectId>()))
        .mutation(({ input, ctx }) => new ProjectController().deleteProjectsHandler(input, ctx)),
});

export default projectRouter;
