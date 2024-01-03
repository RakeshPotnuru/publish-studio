import type { Context } from "../../trpc";
import StatsService from "./stats.service";

export default class StatsController extends StatsService {
    async getTopicStatsHandler(input: { limit?: number }, ctx: Context) {
        const stats = await super.getTopicStats(ctx.user?._id, input.limit);

        return {
            status: "success",
            data: {
                stats,
            },
        };
    }
}
