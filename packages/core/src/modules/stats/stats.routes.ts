import { z } from "zod";

import { proProtectedProcedure, router } from "../../trpc";
import StatsController from "./stats.controller";

const statsRouter = router({
  getCategories: proProtectedProcedure
    .input(
      z.object({
        limit: z.number().optional(),
      }),
    )
    .query(({ input, ctx }) =>
      new StatsController().getCategoryStatsHandler(ctx, input),
    ),

  getProjects: proProtectedProcedure
    .input(
      z.object({
        days: z.number().optional(),
        from: z.date().optional(),
        to: z.date().optional(),
      }),
    )
    .query(({ input, ctx }) =>
      new StatsController().getProjectStatsHandler(ctx, input),
    ),

  getReadingTime: proProtectedProcedure
    .input(
      z.object({
        days: z.number().optional(),
        from: z.date().optional(),
        to: z.date().optional(),
      }),
    )
    .query(({ input, ctx }) =>
      new StatsController().getReadingTimeStatsHandler(ctx, input),
    ),

  getWords: proProtectedProcedure
    .input(
      z.object({
        days: z.number().optional(),
        from: z.date().optional(),
        to: z.date().optional(),
      }),
    )
    .query(({ input, ctx }) =>
      new StatsController().getWordStatsHandler(ctx, input),
    ),

  getEmotions: proProtectedProcedure
    .input(
      z.object({
        days: z.number().optional(),
        from: z.date().optional(),
        to: z.date().optional(),
      }),
    )
    .query(({ input, ctx }) =>
      new StatsController().getEmotionStatsHandler(ctx, input),
    ),
});

export default statsRouter;
