import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import { constants } from "../../../config/constants";
import { logtail } from "../../../utils/logtail";
import Section from "./section.model";
import type {
  ISection,
  TSectionCreateInput,
  TSectionResponse,
  TSectionUpdateInput,
} from "./section.types";

export default class SectionService {
  async createSection(section: TSectionCreateInput): Promise<ISection> {
    try {
      return await Section.create(section);
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id: section.user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while creating the section. Please try again later.",
      });
    }
  }

  async getSectionById(
    id: Types.ObjectId,
    user_id: Types.ObjectId,
  ): Promise<ISection | null> {
    try {
      return await Section.findOne({ user_id, _id: id }).lean().exec();
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while fetching the section. Please try again later.",
      });
    }
  }

  async getSections(user_id: Types.ObjectId): Promise<TSectionResponse[]> {
    try {
      return (await Section.find({ user_id })
        .populate("tasks")
        .sort({ order: 1 })
        .exec()) as TSectionResponse[];
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while fetching the sections. Please try again later.",
      });
    }
  }

  async getSectionsLength(user_id: Types.ObjectId): Promise<number> {
    try {
      return await Section.countDocuments({ user_id }).exec();
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while fetching the sections. Please try again later.",
      });
    }
  }

  async getReservedSection(user_id: Types.ObjectId): Promise<ISection | null> {
    try {
      return await Section.findOne({
        user_id,
        name: constants.planner.section.name.RESERVED,
      }).exec();
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while fetching the reserved section. Please try again later.",
      });
    }
  }

  async updateSection(
    section: TSectionUpdateInput,
    user_id: Types.ObjectId,
  ): Promise<ISection | null> {
    try {
      return await Section.findOneAndUpdate(
        { user_id, _id: section._id },
        section,
        {
          new: true,
        },
      ).exec();
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while updating the section. Please try again later.",
      });
    }
  }

  async deleteSections(
    ids: Types.ObjectId[],
    user_id: Types.ObjectId,
  ): Promise<void> {
    try {
      await Section.deleteMany({
        user_id,
        _id: { $in: ids },
        name: {
          $nin: [constants.planner.section.name.RESERVED],
        },
      }).exec();
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while deleting the sections. Please try again later.",
      });
    }
  }

  async reorderSections(
    sections: { _id: Types.ObjectId; order: number }[],
    user_id: Types.ObjectId,
  ): Promise<void> {
    try {
      await Promise.all(
        sections.map((section) =>
          Section.updateOne(
            { user_id, _id: section._id },
            { order: section.order },
          ).exec(),
        ),
      );
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id,
      });

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while reordering the sections. Please try again later.",
      });
    }
  }
}
