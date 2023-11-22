import { z } from "zod";

import { protectedProcedure, router } from "../../trpc";
import DevToController from "./devto/devto.controller";
import GhostController from "./ghost/ghost.controller";
import type { TGhostStatus } from "./ghost/ghost.types";
import HashnodeController from "./hashnode/hashnode.controller";
import MediumController from "./medium/medium.controller";
import type { TMediumStatus } from "./medium/medium.types";
import PlatformController from "./platform.controller";
import WordPressService from "./wordpress/wordpress.service";

const platformRouter = router({
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
        .mutation(({ input, ctx }) => new HashnodeController().createPlatformHandler(input, ctx)),

    updateHashnode: protectedProcedure
        .input(
            z.object({
                username: z.string(),
                api_key: z.string().optional(),
            }),
        )
        .mutation(({ input, ctx }) => new HashnodeController().updatePlatformHandler(input, ctx)),

    disconnectHashnode: protectedProcedure.query(({ ctx }) =>
        new HashnodeController().deletePlatformHandler(ctx),
    ),

    connectDevTo: protectedProcedure
        .input(
            z.object({
                api_key: z.string(),
                default_publish_status: z.boolean(),
            }),
        )
        .mutation(({ input, ctx }) => new DevToController().createPlatformHandler(input, ctx)),

    updateDevTo: protectedProcedure
        .input(
            z.object({
                api_key: z.string().optional(),
                default_publish_status: z.boolean().optional(),
            }),
        )
        .mutation(({ input, ctx }) => new DevToController().updatePlatformHandler(input, ctx)),

    disconnectDevTo: protectedProcedure.query(({ ctx }) =>
        new DevToController().deletePlatformHandler(ctx),
    ),

    connectMedium: protectedProcedure
        .input(
            z.object({
                api_key: z.string(),
                default_publish_status: z.custom<TMediumStatus>(),
                notify_followers: z.boolean(),
            }),
        )
        .mutation(({ input, ctx }) => new MediumController().createUserHandler(input, ctx)),

    updateMedium: protectedProcedure
        .input(
            z.object({
                api_key: z.string().optional(),
                default_publish_status: z.custom<TMediumStatus>().optional(),
                notify_followers: z.boolean().optional(),
            }),
        )
        .mutation(({ input, ctx }) => new MediumController().updateUserHandler(input, ctx)),

    disconnectMedium: protectedProcedure.query(({ ctx }) =>
        new MediumController().deleteUserHandler(ctx),
    ),

    connectGhost: protectedProcedure
        .input(
            z.object({
                api_url: z.string(),
                admin_api_key: z.string(),
                ghost_version: z.custom<`v5.${string}`>(),
                default_publish_status: z.custom<TGhostStatus>(),
            }),
        )
        .mutation(({ input, ctx }) => new GhostController().createPlatformHandler(input, ctx)),

    updateGhost: protectedProcedure
        .input(
            z.object({
                api_url: z.string(),
                admin_api_key: z.string().optional(),
                ghost_version: z.custom<`v5.${string}`>(),
                default_publish_status: z.custom<TGhostStatus>(),
            }),
        )
        .mutation(({ input, ctx }) => new GhostController().updatePlatformHandler(input, ctx)),

    disconnectGhost: protectedProcedure.query(({ ctx }) =>
        new GhostController().deletePlatformHandler(ctx),
    ),

    connectWordPress: protectedProcedure
        .input(
            z.object({
                api_url: z.string(),
                username: z.string(),
                password: z.string(),
                // default_publish_status: z.custom<TGhostStatus>(),
            }),
        )
        .mutation(({ input }) =>
            new WordPressService().getWordPressSite(input.api_url, input.username, input.password),
        ),
});

export default platformRouter;
