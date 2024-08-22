import { z } from "zod";

import { proProtectedProcedure, router } from "../../../trpc";
import BloggerController from "./blogger.controller";

const bloggerRouter = router({
  connect: proProtectedProcedure
    .input(z.string())
    .mutation(({ input, ctx }) =>
      new BloggerController().createPlatformHandler(input, ctx),
    ),

  update: proProtectedProcedure
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

  disconnect: proProtectedProcedure.query(({ ctx }) =>
    new BloggerController().deletePlatformHandler(ctx),
  ),

  getAuthUrl: proProtectedProcedure.query(({ ctx }) =>
    new BloggerController().getAuthUrlHandler(ctx),
  ),

  getBlogs: proProtectedProcedure.query(({ ctx }) =>
    new BloggerController().getBloggerBlogsHandler(ctx),
  ),

  getAllPosts: proProtectedProcedure
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
