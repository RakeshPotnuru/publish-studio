import { z } from "zod";

import { proProtectedProcedure, router } from "../../../trpc";
import DevToController from "./devto.controller";

const devtoRouter = router({
  connect: proProtectedProcedure
    .input(
      z.object({
        api_key: z.string(),
        status: z.boolean(),
      }),
    )
    .mutation(({ input, ctx }) =>
      new DevToController().createPlatformHandler(input, ctx),
    ),

  update: proProtectedProcedure
    .input(
      z.object({
        api_key: z.string().optional(),
        status: z.boolean().optional(),
      }),
    )
    .mutation(({ input, ctx }) =>
      new DevToController().updatePlatformHandler(input, ctx),
    ),

  disconnect: proProtectedProcedure.query(({ ctx }) =>
    new DevToController().deletePlatformHandler(ctx),
  ),

  getAllPosts: proProtectedProcedure
    .input(
      z.object({
        pagination: z.object({
          page: z.number().default(1),
          limit: z.number().default(10),
        }),
      }),
    )
    .query(({ input, ctx }) =>
      new DevToController().getAllPostsHandler(input, ctx),
    ),
});

export default devtoRouter;
