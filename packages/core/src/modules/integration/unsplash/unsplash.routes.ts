import { z } from "zod";

import { proProtectedProcedure, router } from "../../../trpc";
import UnsplashController from "./unsplash.controller";

const unsplashRouter = router({
  search: proProtectedProcedure
    .input(
      z.object({
        query: z.string(),
        per_page: z.number().int().positive().default(20),
        page: z.number().int().positive().default(1),
      }),
    )
    .query(({ input }) => new UnsplashController().searchPhotosHandler(input)),

  triggerDownload: proProtectedProcedure
    .input(z.string())
    .mutation(({ input }) =>
      new UnsplashController().triggerDownloadHandler(input),
    ),
});

export default unsplashRouter;
