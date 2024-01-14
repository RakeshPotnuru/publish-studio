import { z } from "zod";

import { constants } from "../../../config/constants";
import { protectedProcedure, router } from "../../../trpc";
import MediumController from "./medium.controller";

const mediumRouter = router({
    connect: protectedProcedure
        .input(
            z.object({
                api_key: z.string(),
                status: z.nativeEnum(constants.mediumStatuses),
                notify_followers: z.boolean(),
            }),
        )
        .mutation(({ input, ctx }) => new MediumController().createUserHandler(input, ctx)),

    update: protectedProcedure
        .input(
            z.object({
                api_key: z.string().optional(),
                status: z.nativeEnum(constants.mediumStatuses).optional(),
                notify_followers: z.boolean().optional(),
            }),
        )
        .mutation(({ input, ctx }) => new MediumController().updatePlatformHandler(input, ctx)),

    disconnect: protectedProcedure.query(({ ctx }) =>
        new MediumController().deletePlatformHandler(ctx),
    ),
});

export default mediumRouter;
