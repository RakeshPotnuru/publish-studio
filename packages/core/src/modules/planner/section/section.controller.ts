import { TRPCError } from "@trpc/server";
import type { Types } from "mongoose";

import { constants } from "../../../config/constants";
import type { Context } from "../../../trpc";
import SectionService from "./section.service";
import type {
  ISection,
  TSectionCreateInput,
  TSectionUpdateInput,
} from "./section.types";

export default class SectionController extends SectionService {
  isReservedCheck(name: string) {
    if (name === constants.planner.section.name.RESERVED) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Section name "${name}" is reserved. Please use a different name.`,
      });
    }
  }
  async createSectionHandler(
    section: Pick<TSectionCreateInput, "name">,
    ctx: Context,
  ): Promise<ISection> {
    this.isReservedCheck(section.name);

    const sectionsLength = await super.getSectionsLength(ctx.user._id);

    return super.createSection({
      user_id: ctx.user._id,
      name: section.name,
      order: sectionsLength,
    });
  }

  async updateSectionHandler(input: TSectionUpdateInput, ctx: Context) {
    if (input.name) this.isReservedCheck(input.name);

    return super.updateSection(input, ctx.user._id);
  }

  async deleteSectionsHandler(ids: Types.ObjectId[], ctx: Context) {
    // move tasks to reserved section
    const reservedSection = await super.getReservedSection(ctx.user._id);

    if (reservedSection) {
      for (const id of ids) {
        const section = await super.getSectionById(id, ctx.user._id);
        if (!section?.tasks) continue;

        await super.updateSection(
          {
            _id: reservedSection._id,
            tasks: [...(reservedSection.tasks ?? []), ...section.tasks],
          },
          ctx.user._id,
        );
      }
    }

    return super.deleteSections(ids, ctx.user._id);
  }

  async reorderSectionsHandler(
    sections: { _id: Types.ObjectId; order: number }[],
    ctx: Context,
  ) {
    return super.reorderSections(sections, ctx.user._id);
  }
}
