import { z } from "zod";

import { protectedProcedure, t } from "../../trpc";
import DevToController from "./devto/devto.controller";
import HashnodeController from "./hashnode/hashnode.controller";

const platformRouter = t.router({
    connectHashnode: protectedProcedure
        .input(
            z.object({
                username: z.string(),
                api_key: z.string(),
            }),
        )
        .mutation(({ input, ctx }) =>
            new HashnodeController(ctx.user?._id).createUserHandler(input, ctx),
        ),

    connectDevTo: protectedProcedure
        .input(
            z.object({
                api_key: z.string(),
            }),
        )
        .mutation(({ input, ctx }) =>
            new DevToController(ctx.user?._id).createUserHandler(input, ctx),
        ),
});

export default platformRouter;
