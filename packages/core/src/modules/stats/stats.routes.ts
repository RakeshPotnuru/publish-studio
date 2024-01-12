import { z } from "zod";

import { protectedProcedure, router } from "../../trpc";
import StatsController from "./stats.controller";

const statsRouter = router({
    getTopics: protectedProcedure
        .input(
            z.object({
                limit: z.number().optional(),
            }),
        )
        .query(({ input, ctx }) => new StatsController().getTopicStatsHandler(ctx, input)),

    getProjects: protectedProcedure
        .input(
            z.object({
                days: z.number().optional(),
                from: z.date().optional(),
                to: z.date().optional(),
            }),
        )
        .query(({ input, ctx }) => new StatsController().getProjectStatsHandler(ctx, input)),
});

export default statsRouter;
