import type { Types } from "mongoose";
import { z } from "zod";

import { protectedProcedure, t } from "../../trpc";
import AssetController from "./asset.controller";

const assetRouter = t.router({
    uploadImage: protectedProcedure
        .input(
            z.object({
                file: z.custom<Express.Multer.File>(),
                project_id: z.custom<Types.ObjectId>().optional(),
            }),
        )
        .mutation(({ input, ctx }) => new AssetController().uploadImageHandler(input, ctx)),
});

export default assetRouter;
