import { z } from "zod";

import { constants } from "../../../config/constants";
import { protectedProcedure, router } from "../../../trpc";
import WordPressController from "./wordpress.controller";

const wordpressRouter = router({
    connect: protectedProcedure
        .input(z.string())
        .mutation(({ input, ctx }) => new WordPressController().createPlatformHandler(input, ctx)),

    update: protectedProcedure
        .input(
            z.object({
                publicize: z.boolean(),
                status: z.nativeEnum(constants.wordpressStatuses),
            }),
        )
        .mutation(({ input, ctx }) => new WordPressController().updatePlatformHandler(input, ctx)),

    disconnect: protectedProcedure.query(({ ctx }) =>
        new WordPressController().deletePlatformHandler(ctx),
    ),
});

export default wordpressRouter;
