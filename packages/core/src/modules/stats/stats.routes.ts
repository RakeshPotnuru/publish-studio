import { z } from "zod";

import { protectedProcedure, router } from "../../trpc";
import StatsController from "./stats.controller";

const statsRouter = router({
  getCategories: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional(),
      }),
    )
    .query(({ input, ctx }) =>
      new StatsController().getCategoryStatsHandler(ctx, input),
    ),

  getProjects: protectedProcedure
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

  getReadingTime: protectedProcedure
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

  getWords: protectedProcedure
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

  getEmotions: protectedProcedure
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
