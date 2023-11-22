import type { Types } from "mongoose";
import { z } from "zod";

import { protectedProcedure, router } from "../../trpc";
import AssetController from "./asset.controller";
import type { TMimeType } from "./asset.types";

const assetRouter = router({
    uploadImage: protectedProcedure
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
});

export default assetRouter;
