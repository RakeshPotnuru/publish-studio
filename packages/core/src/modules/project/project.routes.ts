import type { Types } from "mongoose";
import { z } from "zod";

import { protectedProcedure, t } from "../../trpc";
import { project, user } from "../../utils/constants";
import ProjectController from "./project.controller";

const projectRouter = t.router({
    createProject: protectedProcedure
        .input(
            z.object({
                project: z.object({
                    folder_id: z.custom<Types.ObjectId>().optional(),
                    title: z.string().min(project.title.MIN_LENGTH).max(project.title.MAX_LENGTH),
                    description: z.string().max(project.description.MAX_LENGTH).optional(),
                    body: z.string().max(project.body.MAX_LENGTH).optional(),
                    tags: z
                        .array(z.string().max(project.tags.tag.MAX_LENGTH))
                        .max(project.tags.MAX_LENGTH)
                        .optional(),
                    status: z.nativeEnum(project.status).optional().default(project.status.DRAFT),
                    cover_image: z.string().optional(),
                    platforms: z.array(z.nativeEnum(user.platforms)),
                }),
            }),
        )
        .mutation(({ input, ctx }) => new ProjectController().createProjectHandler(input, ctx)),

    getAllProjects: protectedProcedure.query(({ ctx }) =>
        new ProjectController().getAllProjectsHandler(ctx),
    ),

    updateProject: protectedProcedure
        .input(
            z.object({
                id: z.custom<Types.ObjectId>(),
                project: z.object({
                    folder_id: z.custom<Types.ObjectId>().optional(),
                    title: z.string().min(project.title.MIN_LENGTH).max(project.title.MAX_LENGTH),
                    description: z.string().max(project.description.MAX_LENGTH).optional(),
                    body: z.string().max(project.body.MAX_LENGTH).optional(),
                    tags: z
                        .array(z.string().max(project.tags.tag.MAX_LENGTH))
                        .max(project.tags.MAX_LENGTH)
                        .optional(),
                    status: z.nativeEnum(project.status).optional().default(project.status.DRAFT),
                    cover_image: z.string().optional(),
                    platforms: z.array(z.nativeEnum(user.platforms)).optional(),
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
