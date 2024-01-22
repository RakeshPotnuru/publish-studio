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

    getAllPosts: protectedProcedure
        .input(
            z.object({
                pagination: z.object({
                    page: z.number().default(1),
                    limit: z.number().default(10),
                }),
            }),
        )
        .query(({ input, ctx }) => new WordPressController().getAllPostsHandler(input, ctx)),
});

export default wordpressRouter;
