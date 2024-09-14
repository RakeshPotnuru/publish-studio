import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import type { IPaginationOptions } from "../../types/common.types";
import { logtail } from "../../utils/logtail";
import Project from "../project/project.model";
import Snippet from "./snippet.model";
import type {
  ISnippet,
  ISnippetsResponse,
  TSnippetCreateInput,
  TSnippetUpdateInput,
} from "./snippet.types";

export default class SnippetService {
  async createSnippet(snippet: TSnippetCreateInput): Promise<ISnippet> {
    try {
      const newSnippet = await Snippet.create(snippet);

      if (snippet.projects) {
        await Project.updateMany(
          { _id: { $in: snippet.projects } },
          { $push: { snippets: newSnippet._id } },
        ).exec();
      }

      return newSnippet;
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id: snippet.user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while creating the snippet. Please try again later.",
      });
    }
  }

  async updateSnippet(
    snippetId: Types.ObjectId,
    snippet: TSnippetUpdateInput,
    user_id: Types.ObjectId,
  ): Promise<ISnippet> {
    try {
      return (await Snippet.findByIdAndUpdate(
        {
          _id: snippetId,
          user_id,
        },
        snippet,
        {
          new: true,
        },
      ).exec()) as ISnippet;
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        snippet_id: snippetId,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while updating the snippet. Please try again later.",
      });
    }
  }

  async getAllSnippets(
    pagination: IPaginationOptions,
    user_id: Types.ObjectId,
  ): Promise<ISnippetsResponse> {
    try {
      const total_rows = await Snippet.countDocuments({ user_id }).exec();
      const total_pages = Math.ceil(total_rows / pagination.limit);

      const snippets = (await Snippet.find({ user_id })
        .populate("projects", "_id name")
        .skip((pagination.page - 1) * pagination.limit)
        .limit(pagination.limit)
        .sort({ updated_at: -1 })
        .exec()) as ISnippet[];

      return {
        snippets,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total_rows,
          total_pages,
        },
      };
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while fetching the snippets. Please try again later.",
      });
    }
  }

  async deleteSnippets(ids: Types.ObjectId[], user_id: Types.ObjectId) {
    try {
      await Project.updateMany(
        { snippets: { $in: ids } },
        { $pull: { snippets: { $in: ids } } },
      ).exec();

      return await Snippet.deleteMany({
        user_id,
        _id: { $in: ids },
      }).exec();
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while deleting the snippets. Please try again later.",
      });
    }
  }
}
