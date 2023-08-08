import { z } from "zod";

import { protectedProcedure, t } from "../../trpc";
import DevToController from "./devto/devto.controller";
import HashnodeController from "./hashnode/hashnode.controller";
import MediumController from "./medium/medium.controller";

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

    updateHashnode: protectedProcedure
        .input(
            z.object({
                username: z.string(),
                api_key: z.string().optional(),
            }),
        )
        .mutation(({ input, ctx }) =>
            new HashnodeController(ctx.user?._id).updateUserHandler(input, ctx),
        ),

    disconectHashnode: protectedProcedure.query(({ ctx }) =>
        new HashnodeController(ctx.user?._id).deleteUserHandler(ctx),
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

    updateDevTo: protectedProcedure
        .input(
            z.object({
                api_key: z.string(),
            }),
        )
        .mutation(({ input, ctx }) =>
            new DevToController(ctx.user?._id).updateUserHandler(input, ctx),
        ),

    disconectDevTo: protectedProcedure.query(({ ctx }) =>
        new DevToController(ctx.user?._id).deleteUserHandler(ctx),
    ),

    connectMedium: protectedProcedure
        .input(
            z.object({
                api_key: z.string(),
            }),
        )
        .mutation(({ input, ctx }) =>
            new MediumController(ctx.user?._id).createUserHandler(input, ctx),
        ),

    updateMedium: protectedProcedure
        .input(
            z.object({
                api_key: z.string(),
            }),
        )
        .mutation(({ input, ctx }) =>
            new MediumController(ctx.user?._id).updateUserHandler(input, ctx),
        ),

    disconectMedium: protectedProcedure.query(({ ctx }) =>
        new MediumController(ctx.user?._id).deleteUserHandler(ctx),
    ),
});

export default platformRouter;
