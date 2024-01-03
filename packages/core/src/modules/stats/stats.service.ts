import type { Types } from "mongoose";

import Project from "../project/project.model";
import type { ITopicStats } from "./stats.types";

export default class StatsService {
    async getTopicStats(
        user_id: Types.ObjectId | undefined,
        limit = 5,
    ): Promise<ITopicStats[]> {
        const data = await Project.aggregate([
            { $match: { user_id } },
            { $unwind: "$topics" },
            { $group: { _id: "$topics", count: { $sum: 1 } } },
            { $sort: { count: -1, _id: 1 } },
            { $limit: limit },
        ]);

        return data.map(topic => ({
            topic: topic._id as string,
            count: topic.count as number,
        }));
    }
}
