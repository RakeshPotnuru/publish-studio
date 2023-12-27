import type { Types } from "mongoose";

import type { Context } from "../../trpc";
import NLUService from "./nlu.service";
import type { TSentimentLabel } from "./nlu.types";

export default class NLUController extends NLUService {
    async getToneAnalysisHandler(
        input: { text: string; project_id: Types.ObjectId },
        ctx: Context,
    ) {
        const { text, project_id } = input;

        const analysis = await super.getToneAnalysis(text);
        console.log(analysis);

        const updatedProject = await super.updateProjectById(
            project_id,
            {
                tone_analysis: {
                    sentiment: analysis.sentiment?.document?.label as TSentimentLabel,
                    emotion: analysis.emotion?.document?.emotion,
                },
            },
            ctx.user?._id,
        );

        return {
            status: "success",
            data: {
                analysis: updatedProject.tone_analysis,
            },
        };
    }
}
