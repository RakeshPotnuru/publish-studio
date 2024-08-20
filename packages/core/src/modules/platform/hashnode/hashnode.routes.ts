import { z } from "zod";

import { proProtectedProcedure, router } from "../../../trpc";
import HashnodeController from "./hashnode.controller";

const hashnodeRouter = router({
  connect: proProtectedProcedure
    .input(
      z.object({
        api_key: z.string(),
        settings: z.object({
          enable_table_of_contents: z.boolean(),
          send_newsletter: z.boolean(),
          delisted: z.boolean(),
        }),
      }),
    )
    .mutation(({ input, ctx }) =>
      new HashnodeController().createPlatformHandler(input, ctx),
    ),

  update: proProtectedProcedure
    .input(
      z.object({
        api_key: z.string().optional(),
        settings: z.object({
          enable_table_of_contents: z.boolean(),
          send_newsletter: z.boolean(),
          delisted: z.boolean(),
        }),
      }),
    )
    .mutation(({ input, ctx }) =>
      new HashnodeController().updatePlatformHandler(input, ctx),
    ),

  disconnect: proProtectedProcedure.query(({ ctx }) =>
    new HashnodeController().deletePlatformHandler(ctx),
  ),

  getAllPosts: proProtectedProcedure
    .input(
      z.object({
        pagination: z.object({
          limit: z.number().default(10),
          end_cursor: z.string().optional(),
        }),
      }),
    )
    .query(({ input, ctx }) =>
      new HashnodeController().getAllPostsHandler(input, ctx),
    ),
});

export default hashnodeRouter;
