import { z } from "zod";

import { protectedProcedure, router } from "../../trpc";
import StatsController from "./stats.controller";

const statsRouter = router({
    getTopicStats: protectedProcedure
        .input(
            z.object({
                limit: z.number().optional(),
            }),
        )
        .query(({ input, ctx }) => new StatsController().getTopicStatsHandler(input, ctx)),
});

export default statsRouter;
