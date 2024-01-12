import { z } from "zod";

import { protectedProcedure, router } from "../../../trpc";
import DevToController from "./devto.controller";

const devtoRouter = router({
    connect: protectedProcedure
        .input(
            z.object({
                api_key: z.string(),
                default_publish_status: z.boolean(),
            }),
        )
        .mutation(({ input, ctx }) => new DevToController().createPlatformHandler(input, ctx)),

    update: protectedProcedure
        .input(
            z.object({
                api_key: z.string().optional(),
                default_publish_status: z.boolean().optional(),
            }),
        )
        .mutation(({ input, ctx }) => new DevToController().updatePlatformHandler(input, ctx)),

    disconnect: protectedProcedure.query(({ ctx }) =>
        new DevToController().deletePlatformHandler(ctx),
    ),
});

export default devtoRouter;
