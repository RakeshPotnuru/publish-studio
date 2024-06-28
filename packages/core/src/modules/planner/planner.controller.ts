import type { Types } from "mongoose";

import { constants } from "../../config/constants";
import User from "../user/user.model";
import SectionService from "./section/section.service";

export default class PlannerController extends SectionService {
  /**
   * Initializes a planner for a user with default sections: To Do, In Progress, Done.
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

  // TODO: one time thing, remove after all users have planner
  async initPlannerForExistingUsers(): Promise<void> {
    const users = await User.find();

    for (const user of users) {
      const sections = await super.getSections(user._id);

      if (sections.length === 0) {
        await this.initPlanner(user._id);
      }
    }
  }
}
