import { z } from "zod";

import { protectedProcedure, router } from "../../../trpc";
import HashnodeController from "./hashnode.controller";

const hashnodeRouter = router({
    connect: protectedProcedure
        .input(
            z.object({
                api_key: z.string(),
                default_settings: z.object({
                    enable_table_of_contents: z.boolean(),
                    send_newsletter: z.boolean(),
                    delisted: z.boolean(),
                }),
            }),
        )
        .mutation(({ input, ctx }) => new HashnodeController().createPlatformHandler(input, ctx)),

    update: protectedProcedure
        .input(
            z.object({
                api_key: z.string().optional(),
                default_settings: z.object({
                    enable_table_of_contents: z.boolean(),
                    send_newsletter: z.boolean(),
                    delisted: z.boolean(),
                }),
            }),
        )
        .mutation(({ input, ctx }) => new HashnodeController().updatePlatformHandler(input, ctx)),

    disconnect: protectedProcedure.query(({ ctx }) =>
        new HashnodeController().deletePlatformHandler(ctx),
    ),
});

export default hashnodeRouter;
