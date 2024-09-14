import type { Types } from "mongoose";

import { constants } from "../../config/constants";
import SectionService from "./section/section.service";

export default class PlannerController extends SectionService {
  /**
   * Initializes a planner for a user with default sections: Unassigned, To Do, In Progress, Done.
   * This is a one-time operation when a user signs up.
   *
   * @param user_id - The ID of the user for whom the planner is being initialized.
   * @returns A Promise that resolves to void.
   */
  async initPlanner(user_id: Types.ObjectId): Promise<void> {
    const sections = [
      constants.planner.section.name.RESERVED,
      "To Do",
      "In Progress",
      "Done",
    ];

    for (const section of sections) {
      await super.createSection({
        user_id,
        name: section,
        order: sections.indexOf(section),
      });
    }
  }
}
