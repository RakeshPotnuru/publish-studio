import { z } from "zod";

import { protectedProcedure, router } from "../../../trpc";
import UnsplashController from "./unsplash.controller";

const unsplashRouter = router({
    searchUnsplash: protectedProcedure
        .input(
            z.object({
                query: z.string(),
                per_page: z.number().int().positive().default(20),
                page: z.number().int().positive().default(1),
            }),
        )
        .mutation(({ input }) => new UnsplashController().searchPhotosHandler(input)),
});

export default unsplashRouter;
