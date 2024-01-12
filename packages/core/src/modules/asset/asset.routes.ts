import type { Types } from "mongoose";
import { z } from "zod";

import { protectedProcedure, router } from "../../trpc";
import AssetController from "./asset.controller";
import type { TMimeType } from "./asset.types";

const assetRouter = router({
    upload: protectedProcedure
        .input(
            z.object({
                file: z.object({
                    originalname: z.string(),
                    mimetype: z.custom<TMimeType>(),
                    size: z.number(),
                }),
                project_id: z.custom<Types.ObjectId>().optional(),
            }),
        )
        .mutation(({ input, ctx }) => new AssetController().uploadImageHandler(input, ctx)),

    getAll: protectedProcedure
        .input(
            z.object({
                pagination: z.object({
                    page: z.number().default(1),
                    limit: z.number().default(10),
                }),
            }),
        )
        .query(({ input, ctx }) => new AssetController().getAllAssetsHandler(input, ctx)),

    delete: protectedProcedure
        .input(z.array(z.custom<Types.ObjectId>()))
        .mutation(({ input, ctx }) => new AssetController().deleteAssetsHandler(input, ctx)),
});

export default assetRouter;
