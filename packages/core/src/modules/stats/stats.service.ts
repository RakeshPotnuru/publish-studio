import type { Types } from "mongoose";

import Project from "../project/project.model";
import type {
  ICategoryStats,
  IEmotionStats,
  IProjectStats,
  IReadTimeStats,
  IWordStats,
} from "./stats.types";

export default class StatsService {
  async getCategoryStats(
    user_id: Types.ObjectId,
    limit = 5,
  ): Promise<ICategoryStats[]> {
    const data = await Project.aggregate([
      { $match: { user_id } },
      { $unwind: "$categories" },
      { $group: { _id: "$categories", count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
      { $limit: limit },
    ]);

    return data
      .filter((category) => category._id !== "")
      .map((category) => ({
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

    const result = [];
    for (let i = 1; i <= days; i++) {
      const date = new Date(from);
      date.setDate(date.getDate() + i);
      const formattedDate = date.toISOString().split("T")[0];
      const project = data.find((p) => p._id === formattedDate);
      result.push({
        date,
        count: project ? project.count : 0,
      });
    }

    return result;
  }

  async getReadingTimeStats(
    user_id: Types.ObjectId,
    days?: number,
    from?: Date,
    to?: Date,
  ): Promise<IReadTimeStats> {
    let data;
    if (days) {
      data = await Project.aggregate([
        {
          $match: {
            user_id,
            updated_at: {
              $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
              $lte: new Date(),
            },
          },
        },
        {
          $group: {
            _id: null,
            read_time: { $sum: "$stats.readingTime" },
          },
        },
      ]);
    } else if (from && to) {
      data = await Project.aggregate([
        {
          $match: {
            user_id,
            updated_at: { $gte: from, $lte: to },
          },
        },
        {
          $group: {
            _id: null,
            read_time: { $sum: "$stats.readingTime" },
          },
        },
      ]);
    } else {
      data = await Project.aggregate([
        {
          $match: {
            user_id,
          },
        },
        {
          $group: {
            _id: null,
            read_time: { $sum: "$stats.readingTime" },
          },
        },
      ]);
    }

    return {
      read_time: data.length > 0 ? data[0].read_time : 0,
    };
  }

  async getWordStats(
    user_id: Types.ObjectId,
    days?: number,
    from?: Date,
    to?: Date,
  ): Promise<IWordStats> {
    let data;
    if (days) {
      data = await Project.aggregate([
        {
          $match: {
            user_id,
            updated_at: {
              $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
              $lte: new Date(),
            },
          },
        },
        {
          $group: {
            _id: null,
            word_count: { $sum: "$stats.wordCount" },
          },
        },
      ]);
    } else if (from && to) {
      data = await Project.aggregate([
        {
          $match: {
            user_id,
            updated_at: { $gte: from, $lte: to },
          },
        },
        {
          $group: {
            _id: null,
            word_count: { $sum: "$stats.wordCount" },
          },
        },
      ]);
    } else {
      data = await Project.aggregate([
        {
          $match: {
            user_id,
          },
        },
        {
          $group: {
            _id: null,
            word_count: { $sum: "$stats.wordCount" },
          },
        },
      ]);
    }

    return {
      word_count: data.length > 0 ? data[0].word_count : 0,
    };
  }

  async getEmotionStats(
    user_id: Types.ObjectId,
    days?: number,
    from?: Date,
    to?: Date,
  ): Promise<IEmotionStats[]> {
    let data;
    if (days) {
      data = await Project.aggregate([
        {
          $match: {
            user_id,
            updated_at: {
              $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
              $lte: new Date(),
            },
          },
        },
        {
          $group: {
            _id: null,
            total_sadness: {
              $sum: "$tone_analysis.emotion.sadness",
            },
            total_joy: {
              $sum: "$tone_analysis.emotion.joy",
            },
            total_fear: {
              $sum: "$tone_analysis.emotion.fear",
            },
            total_disgust: {
              $sum: "$tone_analysis.emotion.disgust",
            },
            total_anger: {
              $sum: "$tone_analysis.emotion.anger",
            },
          },
        },
      ]);
    } else if (from && to) {
      data = await Project.aggregate([
        {
          $match: {
            user_id,
            updated_at: { $gte: from, $lte: to },
          },
        },
        {
          $group: {
            _id: null,
            total_sadness: {
              $sum: "$tone_analysis.emotion.sadness",
            },
            total_joy: {
              $sum: "$tone_analysis.emotion.joy",
            },
            total_fear: {
              $sum: "$tone_analysis.emotion.fear",
            },
            total_disgust: {
              $sum: "$tone_analysis.emotion.disgust",
            },
            total_anger: {
              $sum: "$tone_analysis.emotion.anger",
            },
          },
        },
      ]);
    } else {
      data = await Project.aggregate([
        {
          $match: {
            user_id,
          },
        },
        {
          $group: {
            _id: null,
            total_sadness: {
              $sum: "$tone_analysis.emotion.sadness",
            },
            total_joy: {
              $sum: "$tone_analysis.emotion.joy",
            },
            total_fear: {
              $sum: "$tone_analysis.emotion.fear",
            },
            total_disgust: {
              $sum: "$tone_analysis.emotion.disgust",
            },
            total_anger: {
              $sum: "$tone_analysis.emotion.anger",
            },
          },
        },
      ]);
    }

    return [
      {
        emotion: "Joy",
        score: data.length > 0 ? data[0].total_joy : 0,
      },
      {
        emotion: "Sadness",
        score: data.length > 0 ? data[0].total_sadness : 0,
      },
      {
        emotion: "Fear",
        score: data.length > 0 ? data[0].total_fear : 0,
      },
      {
        emotion: "Disgust",
        score: data.length > 0 ? data[0].total_disgust : 0,
      },
      {
        emotion: "Anger",
        score: data.length > 0 ? data[0].total_anger : 0,
      },
    ];
  }
}
