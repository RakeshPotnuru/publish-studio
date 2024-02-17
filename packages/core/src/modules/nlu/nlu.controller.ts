import type { Types } from "mongoose";

import type { Sentiment } from "../../config/constants";
import type { Context } from "../../trpc";
import NLUService from "./nlu.service";

export default class NLUController extends NLUService {
  async getToneAnalysisHandler(
    input: { text: string; project_id: Types.ObjectId },
    ctx: Context,
  ) {
    const { text, project_id } = input;

    const analysis = await super.getToneAnalysis(text, ctx.user._id);

    const updatedProject = await super.updateProjectById(
      project_id,
      {
        tone_analysis: {
          sentiment: analysis.sentiment?.document?.label as Sentiment,
          emotion: analysis.emotion?.document?.emotion,
        },
      },
      ctx.user._id,
    );

    return {
      status: "success",
      data: {
        analysis: updatedProject.tone_analysis,
      },
    };
  }
}
