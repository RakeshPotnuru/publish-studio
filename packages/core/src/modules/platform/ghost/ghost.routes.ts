import { z } from "zod";

import { GhostStatus } from "../../../config/constants";
import { proProtectedProcedure, router } from "../../../trpc";
import GhostController from "./ghost.controller";

const ghostRouter = router({
  connect: proProtectedProcedure
    .input(
      z.object({
        api_url: z.string(),
        admin_api_key: z.string(),
        status: z.nativeEnum(GhostStatus),
      }),
    )
    .mutation(({ input, ctx }) =>
      new GhostController().createPlatformHandler(input, ctx),
    ),

  update: proProtectedProcedure
    .input(
      z.object({
        api_url: z.string().optional(),
        admin_api_key: z.string().optional(),
        status: z.nativeEnum(GhostStatus).optional(),
      }),
    )
    .mutation(({ input, ctx }) =>
      new GhostController().updatePlatformHandler(input, ctx),
    ),

  disconnect: proProtectedProcedure.query(({ ctx }) =>
    new GhostController().deletePlatformHandler(ctx),
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
      new GhostController().getAllPostsHandler(input, ctx),
    ),
});

export default ghostRouter;
