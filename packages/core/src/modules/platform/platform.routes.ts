import { z } from "zod";

import { protectedProcedure, t } from "../../trpc";
import DevToController from "./devto/devto.controller";
import HashnodeController from "./hashnode/hashnode.controller";
import MediumController from "./medium/medium.controller";
import type { default_publish_status } from "./medium/medium.types";
import PlatformController from "./platform.controller";

const platformRouter = t.router({
    getAllPlatforms: protectedProcedure.query(({ ctx }) =>
        new PlatformController().getAllPlatformsHandler(ctx),
    ),

    connectHashnode: protectedProcedure
        .input(
            z.object({
                username: z.string(),
                api_key: z.string(),
            }),
        )
        .mutation(({ input, ctx }) => new HashnodeController().createUserHandler(input, ctx)),

    updateHashnode: protectedProcedure
        .input(
            z.object({
                username: z.string(),
                api_key: z.string().optional(),
            }),
        )
        .mutation(({ input, ctx }) => new HashnodeController().updateUserHandler(input, ctx)),

    disconnectHashnode: protectedProcedure.query(({ ctx }) =>
        new HashnodeController().deleteUserHandler(ctx),
    ),

    connectDevTo: protectedProcedure
        .input(
            z.object({
                api_key: z.string(),
                default_publish_status: z.boolean(),
            }),
        )
        .mutation(({ input, ctx }) => new DevToController().createUserHandler(input, ctx)),

    updateDevTo: protectedProcedure
        .input(
            z.object({
                api_key: z.string().optional(),
                default_publish_status: z.boolean().optional(),
            }),
        )
        .mutation(({ input, ctx }) => new DevToController().updateUserHandler(input, ctx)),

    disconnectDevTo: protectedProcedure.query(({ ctx }) =>
        new DevToController().deleteUserHandler(ctx),
    ),

    connectMedium: protectedProcedure
        .input(
            z.object({
                api_key: z.string(),
                default_publish_status: z.custom<default_publish_status>(),
                notify_followers: z.boolean(),
            }),
        )
        .mutation(({ input, ctx }) => new MediumController().createUserHandler(input, ctx)),

    updateMedium: protectedProcedure
        .input(
            z.object({
                api_key: z.string().optional(),
                default_publish_status: z.custom<default_publish_status>().optional(),
                notify_followers: z.boolean().optional(),
            }),
        )
        .mutation(({ input, ctx }) => new MediumController().updateUserHandler(input, ctx)),

    disconnectMedium: protectedProcedure.query(({ ctx }) =>
        new MediumController().deleteUserHandler(ctx),
    ),
});

export default platformRouter;
