import type { Context } from "../../trpc";
import StatsService from "./stats.service";

export default class StatsController extends StatsService {
    async getTopicStatsHandler(ctx: Context, input?: { limit?: number }) {
        const stats = await super.getTopicStats(ctx.user?._id, input?.limit);

        return {
            status: "success",
            data: {
                stats,
            },
        };
    }

    async getProjectStatsHandler(ctx: Context, input?: { days?: number; from?: Date; to?: Date }) {
        const stats = await super.getProjectStats(
            ctx.user?._id,
            input?.days,
            input?.from,
            input?.to,
        );

        return {
            status: "success",
            data: {
                stats,
            },
        };
    }
}
