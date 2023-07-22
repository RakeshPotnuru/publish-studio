import type { Types } from "mongoose";
import { z } from "zod";

import ProjectController from "../controllers/project.controller";
import { protectedProcedure, t } from "../trpc";

const projectRouter = t.router({
    createProject: protectedProcedure
        .input(
            z.object({
                folder_id: z.custom<Types.ObjectId>().optional(),
                title: z.string().min(3).max(160),
                description: z.string().max(500).optional(),
                body: z.string().max(100_000).optional(),
                tags: z.array(z.string().max(50)).optional(),
                status: z.enum(["draft", "published"]).optional().default("draft"),
                cover_image: z.string().optional(),
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
                    title: z.string().min(3).max(160),
                    description: z.string().max(500).optional(),
                    body: z.string().max(100_000).optional(),
                    tags: z.array(z.string().max(50)).optional(),
                    status: z.enum(["draft", "published"]).optional().default("draft"),
                    cover_image: z.string().optional(),
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
