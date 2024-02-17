import { z } from "zod";

import { protectedProcedure, router } from "../../../trpc";
import PexelsController from "./pexels.controller";

const pexelsRouter = router({
  search: protectedProcedure
    .input(
      z.object({
        query: z.string(),
        per_page: z.number().int().positive().default(20),
        page: z.number().int().positive().default(1),
      }),
    )
    .query(({ input, ctx }) =>
      new PexelsController().searchPhotosHandler(input, ctx),
    ),
});

export default pexelsRouter;
