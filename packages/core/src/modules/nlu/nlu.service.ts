import { TRPCError } from "@trpc/server";

import defaultConfig from "../../config/app.config";
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
    async getToneAnalysis(text: string) {
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
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }

    async getConcepts(title: string) {
        try {
            const response = await nlu.analyze({
                text: title,
                features: {
                    concepts: {
                        limit: 5,
                    },
                },
            });
            console.log(response.result.concepts);

            return response.result;
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: defaultConfig.defaultErrorMessage,
            });
        }
    }
}
