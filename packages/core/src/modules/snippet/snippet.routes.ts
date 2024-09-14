import type { Types } from "mongoose";
import { z } from "zod";

import type { SnippetType } from "../../config/constants";
import { proProtectedProcedure, router } from "../../trpc";
import SnippetController from "./snippet.controller";
import type { ISnippet, ISnippetsResponse } from "./snippet.types";

const snippetRouter = router({
  create: proProtectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/snippet/create",
        protect: true,
      },
    })
    .input(
      z.object({
        body: z.custom<JSON>().optional(),
        link: z.string().url().optional(),
        type: z.custom<SnippetType>(),
        projects: z.array(z.custom<Types.ObjectId>()).optional(),
      }),
    )
    .output(
      z.object({
        status: z.string(),
        data: z.object({
          snippet: z.custom<ISnippet>(),
        }),
      }),
    )
    .mutation(({ input, ctx }) =>
      new SnippetController().createSnippetHandler(input, ctx),
    ),

  update: proProtectedProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: "/snippet/update",
        protect: true,
      },
    })
    .input(
      z.object({
        id: z.custom<Types.ObjectId>(),
        snippet: z.object({ body: z.custom<JSON>() }),
      }),
    )
    .output(z.boolean())
    .mutation(({ input, ctx }) =>
      new SnippetController().updateSnippetHandler(input, ctx),
    ),

  getAll: proProtectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/snippet/get-all",
        protect: true,
      },
    })
    .input(
      z.object({
        pagination: z.object({
          page: z.number().int().positive().default(1),
          limit: z.number().int().positive().default(10),
        }),
      }),
    )
    .output(
      z.object({
        status: z.string(),
        data: z.object({
          snippets: z.custom<ISnippetsResponse>(),
        }),
      }),
    )
    .query(({ input, ctx }) =>
      new SnippetController().getAllSnippetsHandler(input, ctx),
    ),

  delete: proProtectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/snippet/delete",
        protect: true,
      },
    })
    .input(z.object({ ids: z.array(z.custom<Types.ObjectId>()) }))
    .output(
      z.object({
        status: z.string(),
        data: z.object({
          snippets: z.custom<{
            acknowledged: boolean;
            deletedCount: number;
          }>(),
        }),
      }),
    )
    .mutation(({ input, ctx }) =>
      new SnippetController().deleteSnippetsHandler(input, ctx),
    ),
});

export default snippetRouter;
