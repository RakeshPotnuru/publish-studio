import type { Types } from "mongoose";
import { z } from "zod";

import { constants } from "../../config/constants";
import { proProtectedProcedure, router } from "../../trpc";
import NLUController from "./nlu.controller";

const nluRouter = router({
  getToneAnalysis: proProtectedProcedure
    .input(
      z.object({
        text: z
          .string()
          .min(constants.project.tone_analysis.input.MIN_LENGTH, {
            message: "Text is too short",
          })
          .max(constants.project.tone_analysis.input.MAX_LENGTH),
        project_id: z.custom<Types.ObjectId>(),
      }),
    )
    .mutation(({ input, ctx }) =>
      new NLUController().getToneAnalysisHandler(input, ctx),
    ),
});

export default nluRouter;
