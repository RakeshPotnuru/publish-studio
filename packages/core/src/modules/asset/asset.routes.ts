import type { Types } from "mongoose";
import { z } from "zod";

import { MimeType } from "../../config/constants";
import { proProtectedProcedure, router } from "../../trpc";
import AssetController from "./asset.controller";

const assetRouter = router({
  upload: proProtectedProcedure
    .input(
      z.object({
        file: z.object({
          originalname: z.string(),
          mimetype: z.nativeEnum(MimeType),
          size: z.number(),
        }),
        project_id: z.custom<Types.ObjectId>().optional(),
      }),
    )
    .mutation(({ input, ctx }) =>
      new AssetController().uploadImageHandler(input, ctx),
    ),

  getAll: proProtectedProcedure
    .input(
      z.object({
        pagination: z.object({
          page: z.number().default(1),
          limit: z.number().default(10),
        }),
      }),
    )
    .query(({ input, ctx }) =>
      new AssetController().getAllAssetsHandler(input, ctx),
    ),

  delete: proProtectedProcedure
    .input(z.array(z.custom<Types.ObjectId>()))
    .mutation(({ input, ctx }) =>
      new AssetController().deleteAssetsHandler(input, ctx),
    ),
});

export default assetRouter;
