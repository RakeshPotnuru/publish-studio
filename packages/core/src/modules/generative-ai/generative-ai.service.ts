import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { TRPCError } from "@trpc/server";

import { constants } from "../../config/constants";
import { ai } from "../../utils/google/gemini";
import ProjectService from "../project/project.service";

export default class GenerativeAIService extends ProjectService {
    private readonly SAFETY_SETTINGS = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
    ];

    private default_generation_config = {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
    };

    async generateTitle(topic: string) {
        const parts = [
            { text: "Topic: What is backend testing?" },
            { text: "Title: What is Backend Testing? - Essential Techniques Unveiled" },
            { text: "Topic: Data science vs web development" },
            { text: "Title: Data Science vs Web Dev: Comparing Two Booming Tech Fields" },
            { text: "Topic: HTTP Status Codes" },
            { text: "Title: A Guide to HTTP Status Codes: What Each Code Means" },
            { text: "Topic: Is Webassembly the future?" },
            { text: "Title: Is WebAssembly the Future? The Next Frontier in Web Dev" },
            { text: "Topic: What is load balancing and how does it work?" },
            { text: "Title: How Load Balancing Works to Optimize Traffic Distribution" },
            { text: `Topic: ${topic}` },
        ];

        try {
            const result = await ai.generateContent({
                contents: [{ role: "user", parts }],
                generationConfig: {
                    ...this.default_generation_config,
                    maxOutputTokens: constants.project.title.RECOMMENDED_MAX_LENGTH,
                },
                safetySettings: this.SAFETY_SETTINGS,
            });

            const response = result.response;

            return response.text();
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Something went wrong while generating a title. Please try again later.",
            });
        }
    }

    async generateDescription(title: string) {
        const parts = [
            { text: "Title: Data Science vs Web Dev: Comparing Two Booming Tech Fields" },
            {
                text: "Description: Compares data science and web development. Analyzes core components, career pathways, and required skills. Discusses intersection to determine the right career path.",
            },
            { text: "Title: A Guide to HTTP Status Codes: What Each Code Means" },
            {
                text: "Description: Unlock the mystery of HTTP status codes with our comprehensive guide. Learn about different codes, their meanings, and how to troubleshoot issues.",
            },
            { text: "Title: Is WebAssembly the Future? The Next Frontier in Web Dev" },
            {
                text: "Description: Explore the potential of WebAssembly and dive into the question: Is WebAssembly the future? Uncover its impact on web dev and the evolving digital landscape.",
            },
            { text: "Title: Javascript vs Typescript: Key differences, the best choice" },
            {
                text: "Description: Practical comparison of TypeScript and JavaScript, including key differences, pros/cons, suitability for future development, and TS-to-JS conversion examples.",
            },
            { text: "Title: How Load Balancing Works to Optimize Traffic Distribution" },
            {
                text: "Description: Discover the power of load balancing! Learn how it optimizes traffic distribution for seamless user experiences. Dive into the world of efficient network management.",
            },
            { text: `Title: ${title}` },
        ];

        try {
            const result = await ai.generateContent({
                contents: [{ role: "user", parts }],
                generationConfig: {
                    ...this.default_generation_config,
                    maxOutputTokens: constants.project.description.RECOMMENDED_MAX_LENGTH,
                },
                safetySettings: this.SAFETY_SETTINGS,
            });

            const response = result.response;

            return response.text();
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message:
                    "Something went wrong while generating a description. Please try again later.",
            });
        }
    }

    async generateOutline(title: string) {
        const parts = [
            {
                text: `Generate a markdown-based blog outline for the topic "${title}".`,
            },
        ];

        try {
            const result = await ai.generateContent({
                contents: [{ role: "user", parts }],
                generationConfig: this.default_generation_config,
                safetySettings: this.SAFETY_SETTINGS,
            });

            const response = result.response;
            console.log(response.text());

            return response.text();
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message:
                    "Something went wrong while generating an outline. Please try again later.",
            });
        }
    }
}
