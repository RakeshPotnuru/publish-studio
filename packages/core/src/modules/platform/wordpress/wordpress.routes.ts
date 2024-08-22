import { z } from "zod";

import { WordPressStatus } from "../../../config/constants";
import { proProtectedProcedure, router } from "../../../trpc";
import WordPressController from "./wordpress.controller";

const wordpressRouter = router({
  connect: proProtectedProcedure
    .input(z.string())
    .mutation(({ input, ctx }) =>
      new WordPressController().createPlatformHandler(input, ctx),
    ),

  update: proProtectedProcedure
    .input(
      z.object({
        publicize: z.boolean(),
        status: z.nativeEnum(WordPressStatus),
      }),
    )
    .mutation(({ input, ctx }) =>
      new WordPressController().updatePlatformHandler(input, ctx),
    ),

  disconnect: proProtectedProcedure.query(({ ctx }) =>
    new WordPressController().deletePlatformHandler(ctx),
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
      new WordPressController().getAllPostsHandler(input, ctx),
    ),
});

export default wordpressRouter;
