import type { Types } from "mongoose";

import Project from "../project/project.model";
import type { ICategoryStats, IProjectStats } from "./stats.types";

export default class StatsService {
    async getCategoryStats(user_id: Types.ObjectId, limit = 5): Promise<ICategoryStats[]> {
        const data = await Project.aggregate([
            { $match: { user_id } },
            { $unwind: "$categories" },
            { $group: { _id: "$categories", count: { $sum: 1 } } },
            { $sort: { count: -1, _id: 1 } },
            { $limit: limit },
        ]);

        return data.map(category => ({
            category: category._id as string,
            count: category.count as number,
        }));
    }

    async getProjectStats(
        user_id: Types.ObjectId,
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
