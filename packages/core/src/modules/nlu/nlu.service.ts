import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import defaultConfig from "../../config/app.config";
import { logtail } from "../../utils/logtail";
import nlu from "../../utils/nlu";
import ProjectService from "../project/project.service";

export default class NLUService extends ProjectService {
  /**
   * The function `getToneAnalysis` uses the Watson Natural Language Understanding service to analyze
   * the tone of a given text and returns the result.
   * @param {string} text - The `text` parameter is a string that represents the text you want to
   * analyze for tone. It can be any piece of text, such as a sentence, paragraph, or document. The
   * function `getToneAnalysis` uses this parameter to perform tone analysis on the given text.
   * @returns The function `getToneAnalysis` is returning the result of the tone analysis performed
   * on the given text.
   */
  async getToneAnalysis(text: string, user_id: Types.ObjectId) {
    try {
      const response = await nlu.analyze({
        text,
        features: {
          emotion: {},
          sentiment: {},
        },
      });

      return response.result;
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: defaultConfig.defaultErrorMessage,
      });
    }
  }
}
