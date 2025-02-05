import type { Types } from "mongoose";
import { z } from "zod";

import { constants, Platform, ProjectStatus } from "../../config/constants";
import { proProtectedProcedure, router } from "../../trpc";
import ProjectController from "./project.controller";

const projectRouter = router({
  create: proProtectedProcedure
    .input(
      z.object({
        folder_id: z.custom<Types.ObjectId>().optional(),
        name: z
          .string()
          .min(constants.project.name.MIN_LENGTH)
          .max(constants.project.name.MAX_LENGTH),
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
        status: z
          .nativeEnum(ProjectStatus)
          .optional()
          .default(ProjectStatus.DRAFT),
        cover_image: z.string().optional(),
        platforms: z.array(z.nativeEnum(Platform)).optional(),
        tags: z
          .object({
            devto_tags: z.array(z.string()).optional(),
            // hashnode_tags: z.array(z.object({
            //     name: z.string(),
            //     slug: z.string(),
            //     id: z.string(),
            // })).optional(),
            medium_tags: z.array(z.string()).optional(),
            ghost_tags: z
              .array(
                z.object({
                  name: z.string(),
                }),
              )
              .optional(),
            wordpress_tags: z.array(z.string()).optional(),
            blogger_tags: z.array(z.string()).optional(),
          })
          .optional(),
        canonical_url: z.string().optional(),
        published_at: z.date().optional(),
        stats: z
          .object({
            readingTime: z.number().int().optional(),
            wordCount: z.number().int().optional(),
          })
          .optional(),
      }),
    )
    .mutation(({ input, ctx }) =>
      new ProjectController().createProjectHandler(input, ctx),
    ),

  getById: proProtectedProcedure
    .input(z.custom<Types.ObjectId>())
    .query(({ input, ctx }) =>
      new ProjectController().getProjectByIdHandler(input, ctx),
    ),

  getAll: proProtectedProcedure
    .input(
      z.object({
        pagination: z.object({
          page: z.number().int().positive().default(1),
          limit: z.number().int().positive().default(10),
        }),
      }),
    )
    .query(({ input, ctx }) =>
      new ProjectController().getAllProjectsHandler(input, ctx),
    ),

  getByFolderId: proProtectedProcedure
    .input(
      z.object({
        folder_id: z.custom<Types.ObjectId>(),
        pagination: z.object({
          page: z.number().int().positive().default(1),
          limit: z.number().int().positive().default(10),
        }),
      }),
    )
    .query(({ input, ctx }) =>
      new ProjectController().getProjectsByFolderIdHandler(input, ctx),
    ),

  update: proProtectedProcedure
    .input(
      z.object({
        id: z.custom<Types.ObjectId>(),
        project: z.object({
          folder_id: z.custom<Types.ObjectId>().optional(),
          name: z
            .string()
            .min(constants.project.name.MIN_LENGTH)
            .max(constants.project.name.MAX_LENGTH)
            .optional(),
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
          status: z.nativeEnum(ProjectStatus).optional(),
          cover_image: z.string().optional(),
          tags: z
            .object({
              devto_tags: z.array(z.string()).optional(),
              // hashnode_tags: z.array(z.object({
              //     name: z.string(),
              //     slug: z.string(),
              //     id: z.string(),
              // })).optional(),
              medium_tags: z.array(z.string()).optional(),
              ghost_tags: z
                .array(
                  z.object({
                    name: z.string(),
                  }),
                )
                .optional(),
              wordpress_tags: z.array(z.string()).optional(),
              blogger_tags: z.array(z.string()).optional(),
            })
            .optional(),
          canonical_url: z.string().optional(),
          categories: z.array(z.string()).optional(),
          scheduled_at: z.string().pipe(z.coerce.date()).optional(),
          stats: z
            .object({
              readingTime: z.number().int().optional(),
              wordCount: z.number().int().optional(),
            })
            .optional(),
        }),
      }),
    )
    .mutation(({ input, ctx }) =>
      new ProjectController().updateProjectHandler(input, ctx),
    ),

  delete: proProtectedProcedure
    .input(z.array(z.custom<Types.ObjectId>()))
    .mutation(({ input, ctx }) =>
      new ProjectController().deleteProjectsHandler(input, ctx),
    ),

  categories: proProtectedProcedure.query(({ ctx }) =>
    new ProjectController().getCategoriesHandler(ctx),
  ),
});

export default projectRouter;
