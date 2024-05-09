import { Router } from "express";
import type { Types } from "mongoose";
import { z } from "zod";

import { constants, TextTone } from "../../config/constants";
import { validate } from "../../middlewares/validation";
import { proProtectedProcedure, router } from "../../trpc";
import GenerativeAIController from "./generative-ai.controller";

const generativeAIRouter = router({
  generate: router({
    title: proProtectedProcedure
      .input(z.object({ project_id: z.custom<Types.ObjectId>() }))
      .mutation(({ input, ctx }) =>
        new GenerativeAIController().generateTitleHandler(input, ctx),
      ),

    description: proProtectedProcedure
      .input(z.object({ project_id: z.custom<Types.ObjectId>() }))
      .mutation(({ input, ctx }) =>
        new GenerativeAIController().generateDescriptionHandler(input, ctx),
      ),

    outline: proProtectedProcedure
      .input(z.object({ project_id: z.custom<Types.ObjectId>() }))
      .mutation(({ input, ctx }) =>
        new GenerativeAIController().generateOutlineHandler(input, ctx),
      ),

    categories: proProtectedProcedure
      .input(z.object({ text: z.string() }))
      .mutation(({ input, ctx }) =>
        new GenerativeAIController().generateCategoriesHandler(input, ctx),
      ),
  }),
});

export default generativeAIRouter;

const generativeAIRouterExp = Router();

generativeAIRouterExp.post(
  `/${constants.genAI.changeTone.path}`,
  validate(
    z.object({
      text: z
        .string()
        .min(constants.genAI.changeTone.MIN_LENGTH)
        .max(constants.genAI.changeTone.MAX_LENGTH),
      tone: z.nativeEnum(TextTone),
    }),
  ),
  (req, res) => new GenerativeAIController().changeToneHandler(req, res),
);

generativeAIRouterExp.post(
  `/${constants.genAI.shortenText.path}`,
  validate(
    z.object({
      text: z
        .string()
        .min(constants.genAI.shortenText.MIN_LENGTH)
        .max(constants.genAI.shortenText.MAX_LENGTH),
    }),
  ),
  (req, res) => new GenerativeAIController().shortenTextHandler(req, res),
);

generativeAIRouterExp.post(
  `/${constants.genAI.expandText.path}`,
  validate(
    z.object({
      text: z
        .string()
        .min(constants.genAI.expandText.MIN_LENGTH)
        .max(constants.genAI.expandText.MAX_LENGTH),
    }),
  ),
  (req, res) => new GenerativeAIController().expandTextHandler(req, res),
);

generativeAIRouterExp.post(
  `/${constants.genAI.numberedList.path}`,
  validate(
    z.object({
      text: z
        .string()
        .min(constants.genAI.numberedList.MIN_LENGTH)
        .max(constants.genAI.numberedList.MAX_LENGTH),
    }),
  ),
  (req, res) =>
    new GenerativeAIController().generateNumberedListHandler(req, res),
);

generativeAIRouterExp.post(
  `/${constants.genAI.bulletList.path}`,
  validate(
    z.object({
      text: z
        .string()
        .min(constants.genAI.bulletList.MIN_LENGTH)
        .max(constants.genAI.bulletList.MAX_LENGTH),
    }),
  ),
  (req, res) =>
    new GenerativeAIController().generateBulletListHandler(req, res),
);

export { generativeAIRouterExp };
