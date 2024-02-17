import type { Types } from "mongoose";
import { z } from "zod";

import { Platform, PostStatus } from "../../config/constants";
import { proProtectedProcedure, protectedProcedure, router } from "../../trpc";
import PublishController from "./publish/publish.controller";

const postRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        project_id: z.custom<Types.ObjectId>(),
        platform: z.nativeEnum(Platform),
        post_id: z.string().optional(),
        status: z.nativeEnum(PostStatus).optional(),
        published_url: z.string().optional(),
        published_at: z.date().optional(),
      }),
    )
    .mutation(({ input, ctx }) =>
      new PublishController().createPostHandler(input, ctx),
    ),

  publish: protectedProcedure
    .input(
      z.object({
        project_id: z.custom<Types.ObjectId>(),
        scheduled_at: z.date().optional(),
        platforms: z.array(z.nativeEnum(Platform)).min(1),
      }),
    )
    .mutation(({ input, ctx }) =>
      new PublishController().publishPostHandler(input, ctx),
    ),

  edit: proProtectedProcedure
    .input(
      z.object({
        project_id: z.custom<Types.ObjectId>(),
        platforms: z.array(z.nativeEnum(Platform)).min(1),
      }),
    )
    .mutation(({ input, ctx }) =>
      new PublishController().editPostHandler(input, ctx),
    ),

  getAllByProjectId: protectedProcedure
    .input(z.custom<Types.ObjectId>())
    .query(({ input, ctx }) =>
      new PublishController().getPostsByProjectIdHandler(input, ctx),
    ),
});

export default postRouter;
