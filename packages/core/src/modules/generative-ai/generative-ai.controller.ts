import { TRPCError } from "@trpc/server";
import type { Request, Response } from "express";
import type { Types } from "mongoose";

import type { Context } from "../../trpc";
import GenerativeAIService from "./generative-ai.service";

export default class GenerativeAIController extends GenerativeAIService {
  async generateTitleHandler(
    input: { project_id: Types.ObjectId },
    ctx: Context,
  ) {
    const project = await super.getProjectById(input.project_id, ctx.user._id);

    if (!project) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Project not found.",
      });
    }

    const title = await super.generateTitle(project.name, ctx.user._id);

    return { status: "success", data: { title } };
  }

  async generateDescriptionHandler(
    input: { project_id: Types.ObjectId },
    ctx: Context,
  ) {
    const project = await super.getProjectById(input.project_id, ctx.user._id);

    if (!project) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Project not found.",
      });
    }

    const description = await super.generateDescription(
      project.name,
      ctx.user._id,
    );

    return { status: "success", data: { description } };
  }

  async generateOutlineHandler(
    input: { project_id: Types.ObjectId },
    ctx: Context,
  ) {
    const project = await super.getProjectById(input.project_id, ctx.user._id);

    if (!project) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Project not found.",
      });
    }

    const output = await super.generateOutline(
      project.title ?? project.name,
      ctx.user._id,
    );

    return { status: "success", data: { outline: output } };
  }

  async generateCategoriesHandler(input: { text: string }, ctx: Context) {
    const output = await super.generateCategories(input.text, ctx.user._id);

    // eslint-disable-next-line unicorn/better-regex
    const regex = /categories: \[(.*?)\]/;
    const match = new RegExp(regex).exec(output);

    if (!match) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "Unable to generate categories. Try changing the project name.",
      });
    }

    const categories = match[1].trim().split(",");

    return { status: "success", data: { categories } };
  }

  async changeToneHandler(req: Request, res: Response) {
    return await super.changeTone(req, res);
  }

  async shortenTextHandler(req: Request, res: Response) {
    return await super.shortenText(req, res);
  }

  async expandTextHandler(req: Request, res: Response) {
    return await super.expandText(req, res);
  }

  async generateNumberedListHandler(req: Request, res: Response) {
    return await super.generateNumberedList(req, res);
  }

  async generateBulletListHandler(req: Request, res: Response) {
    return await super.generateBulletList(req, res);
  }

  async genIdeasBasedOnPastContentHandler(ctx: Context) {
    const output = await super.genIdeasBasedOnPastContent(ctx.user._id);

    const ideas = JSON.parse(output).map(
      (idea: string[]) => idea[0],
    ) as string[];

    if (ideas.length === 0) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Unable to generate ideas. Please try again.",
      });
    }

    return { status: "success", data: { ideas } };
  }

  async genIdeasBasedOnCategoryHandler(category: string, ctx: Context) {
    const output = await super.genIdeasBasedOnCategory(category, ctx.user._id);

    const ideas = JSON.parse(output).map(
      (idea: string[]) => idea[0],
    ) as string[];

    if (ideas.length === 0) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Unable to generate ideas. Please try again.",
      });
    }

    return { status: "success", data: { ideas } };
  }

  async genIdeasBasedOnTextHandler(text: string, ctx: Context) {
    const output = await super.genIdeasBasedOnText(text, ctx.user._id);

    const ideas = JSON.parse(output).map(
      (idea: string[]) => idea[0],
    ) as string[];

    if (ideas.length === 0) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Unable to generate ideas. Please try again.",
      });
    }

    return { status: "success", data: { ideas } };
  }
}
