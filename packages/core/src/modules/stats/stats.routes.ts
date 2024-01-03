import { z } from "zod";

import { protectedProcedure, router } from "../../trpc";
import StatsController from "./stats.controller";

const statsRouter = router({
    getTopicStats: protectedProcedure
        .input(
            z
                .object({
                    limit: z.number().optional(),
                })
                .optional(),
        )
        .query(({ input, ctx }) => new StatsController().getTopicStatsHandler(ctx, input)),

    getProjectStats: protectedProcedure
        .input(
            z
                .object({
                    days: z.number().optional(),
                    from: z.date().optional(),
                    to: z.date().optional(),
                })
                .optional(),
        )
        .query(({ input, ctx }) => new StatsController().getProjectStatsHandler(ctx, input)),
});

export default statsRouter;
