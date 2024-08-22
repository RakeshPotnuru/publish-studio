import { z } from "zod";

import { proProtectedProcedure, router } from "../../trpc";
import bloggerRouter from "./blogger/blogger.routes";
import devtoRouter from "./devto/devto.routes";
import ghostRouter from "./ghost/ghost.routes";
import hashnodeRouter from "./hashnode/hashnode.routes";
import mediumRouter from "./medium/medium.routes";
import PlatformController from "./platform.controller";
import wordpressRouter from "./wordpress/wordpress.routes";

const platformRouter = router({
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
      new PlatformController().getAllPlatformsHandler(input, ctx),
    ),

  hashnode: hashnodeRouter,
  devto: devtoRouter,
  medium: mediumRouter,
  ghost: ghostRouter,
  wordpress: wordpressRouter,
  blogger: bloggerRouter,
});

export default platformRouter;
