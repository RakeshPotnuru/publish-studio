import type { Types } from "mongoose";

import type { Context } from "../../trpc";
import type { IPaginationOptions } from "../../types/common.types";
import SnippetService from "./snippet.service";
import type { TSnippetCreateInput, TSnippetUpdateInput } from "./snippet.types";

export default class SnippetController extends SnippetService {
  async createSnippetHandler(
    input: Omit<TSnippetCreateInput, "user_id">,
    ctx: Context,
  ) {
    const snippet = {
      ...input,
      user_id: ctx.user._id,
    };

    const newSnippet = await super.createSnippet(snippet);

    return {
      status: "success",
      data: {
        snippet: newSnippet,
      },
    };
  }

  async updateSnippetHandler(
    input: { id: Types.ObjectId; snippet: TSnippetUpdateInput },
    ctx: Context,
  ) {
    await super.updateSnippet(input.id, input.snippet, ctx.user._id);

    return true;
  }

  async getAllSnippetsHandler(
    input: {
      pagination: IPaginationOptions;
    },
    ctx: Context,
  ) {
    const snippets = await super.getAllSnippets(input.pagination, ctx.user._id);

    return {
      status: "success",
      data: {
        snippets,
      },
    };
  }

  async deleteSnippetsHandler(input: { ids: Types.ObjectId[] }, ctx: Context) {
    const deleteSnippets = await super.deleteSnippets(input.ids, ctx.user._id);

    return {
      status: "success",
      data: {
        snippets: deleteSnippets,
      },
    };
  }
}
