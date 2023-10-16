import type { Types } from "mongoose";
import { z } from "zod";

import { constants } from "../../constants";
import { proProtectedProcedure, protectedProcedure, t } from "../../trpc";
import ProjectController from "./project.controller";
import type { hashnode_tags } from "./project.types";

const projectRouter = t.router({
    createProject: protectedProcedure
        .input(
            z.object({
                project: z.object({
                    folder_id: z.custom<Types.ObjectId>().optional(),
                    title: z
                        .string()
                        .min(constants.project.title.MIN_LENGTH)
                        .max(constants.project.title.MAX_LENGTH),
                    description: z
                        .string()
                        .max(constants.project.description.MAX_LENGTH)
                        .optional(),
                    body: z.string().max(constants.project.body.MAX_LENGTH).optional(),
                    tags: z
                        .array(z.string().max(constants.project.tags.tag.MAX_LENGTH))
                        .max(constants.project.tags.MAX_LENGTH)
                        .optional(),
                    status: z
                        .nativeEnum(constants.project.status)
                        .optional()
                        .default(constants.project.status.DRAFT),
                    cover_image: z.string().optional(),
                    scheduled_at: z.string().pipe(z.coerce.date()).optional(),
                }),
            }),
        )
        .mutation(({ input, ctx }) => new ProjectController().createProjectHandler(input, ctx)),

    publishPost: protectedProcedure
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
                hashnode_tags: z.custom<hashnode_tags>().optional(),
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
                hashnode_tags: z.custom<hashnode_tags>().optional(),
            }),
        )
        .mutation(({ input, ctx }) => new ProjectController().updatePostHandler(input, ctx)),

    getAllProjects: protectedProcedure.query(({ ctx }) =>
        new ProjectController().getAllProjectsHandler(ctx),
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
                        .max(constants.project.title.MAX_LENGTH),
                    description: z
                        .string()
                        .max(constants.project.description.MAX_LENGTH)
                        .optional(),
                    body: z.string().max(constants.project.body.MAX_LENGTH).optional(),
                    tags: z
                        .array(z.string().max(constants.project.tags.tag.MAX_LENGTH))
                        .max(constants.project.tags.MAX_LENGTH)
                        .optional(),
                    status: z
                        .nativeEnum(constants.project.status)
                        .optional()
                        .default(constants.project.status.DRAFT),
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
        .mutation(({ input }) => new ProjectController().updateProjectHandler(input)),

    deleteProject: protectedProcedure
        .input(
            z.object({
                id: z.custom<Types.ObjectId>(),
            }),
        )
        .mutation(({ input }) => new ProjectController().deleteProjectHandler(input)),
});

export default projectRouter;
