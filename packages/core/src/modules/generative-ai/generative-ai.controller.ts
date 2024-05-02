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

    const output = await super.generateTitle(project.name, ctx.user._id);

    const regex = /Title: (.*?)(?:Topic:|$)/;
    const match = new RegExp(regex).exec(output);

    if (!match) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Unable to generate title. Try changing the project name.",
      });
    }

    const title = match[1].trim();

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

    const output = await super.generateDescription(
      project.title ?? project.name,
      ctx.user._id,
    );

    const regex = /Description: (.*?)(?:Title:|$)/;
    const match = new RegExp(regex).exec(output);

    if (!match) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Unable to generate description. Please try again.",
      });
    }

    const description = match[1].trim();

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
}
