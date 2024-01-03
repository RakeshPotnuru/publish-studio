import type { Types } from "mongoose";

import Project from "../project/project.model";
import type { IProjectStats, ITopicStats } from "./stats.types";

export default class StatsService {
    async getTopicStats(user_id: Types.ObjectId | undefined, limit = 5): Promise<ITopicStats[]> {
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

    async getProjectStats(
        user_id: Types.ObjectId | undefined,
        days = 7,
        from: Date = new Date(new Date().setDate(new Date().getDate() - days)),
        to: Date = new Date(),
    ): Promise<IProjectStats[]> {
        const data = await Project.aggregate([
            {
                $match: {
                    user_id,
                    created_at: { $gte: from, $lte: to },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$created_at",
                        },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        return data.map(project => ({
            date: new Date(project._id as string),
            count: project.count as number,
        }));
    }
}
