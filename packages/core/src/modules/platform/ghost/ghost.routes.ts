import { z } from "zod";

import { constants } from "../../../config/constants";
import { protectedProcedure, router } from "../../../trpc";
import GhostController from "./ghost.controller";
import type { TGhostStatus } from "./ghost.types";

const ghostRouter = router({
    connect: protectedProcedure
        .input(
            z.object({
                api_url: z.string(),
                admin_api_key: z.string(),
                default_publish_status: z.nativeEnum(constants.ghostStatuses),
            }),
        )
        .mutation(({ input, ctx }) => new GhostController().createPlatformHandler(input, ctx)),

    update: protectedProcedure
        .input(
            z.object({
                api_url: z.string().optional(),
                admin_api_key: z.string().optional(),
                default_publish_status: z.custom<TGhostStatus>().optional(),
            }),
        )
        .mutation(({ input, ctx }) => new GhostController().updatePlatformHandler(input, ctx)),

    disconnect: protectedProcedure.query(({ ctx }) =>
        new GhostController().deletePlatformHandler(ctx),
    ),
});

export default ghostRouter;
