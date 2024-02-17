import { z } from "zod";

import { protectedProcedure, router } from "../../../trpc";
import BloggerController from "./blogger.controller";

const bloggerRouter = router({
  connect: protectedProcedure
    .input(z.string())
    .mutation(({ input, ctx }) =>
      new BloggerController().createPlatformHandler(input, ctx),
    ),

  update: protectedProcedure
    .input(
      z.object({
        blog_id: z.string(),
        blog_url: z.string(),
        status: z.boolean(),
      }),
    )
    .mutation(({ input, ctx }) =>
      new BloggerController().updatePlatformHandler(input, ctx),
    ),

  disconnect: protectedProcedure.query(({ ctx }) =>
    new BloggerController().deletePlatformHandler(ctx),
  ),

  getAuthUrl: protectedProcedure.query(({ ctx }) =>
    new BloggerController().getAuthUrlHandler(ctx),
  ),

  getBlogs: protectedProcedure.query(({ ctx }) =>
    new BloggerController().getBloggerBlogsHandler(ctx),
  ),

  getAllPosts: protectedProcedure
    .input(
      z.object({
        pagination: z.object({
          limit: z.number().default(10),
          page_token: z.string().optional(),
        }),
      }),
    )
    .query(({ input, ctx }) =>
      new BloggerController().getAllPostsHandler(input, ctx),
    ),
});

export default bloggerRouter;
