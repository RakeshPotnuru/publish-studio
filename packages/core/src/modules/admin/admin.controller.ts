import { TRPCError } from "@trpc/server";
import mongoose from "mongoose";

import defaultConfig from "../../config/app";
import { EmailTemplate, UserType } from "../../config/constants";
import { logtail } from "../../utils/logtail";
import redisClient from "../../utils/redis";
import { sgMail } from "../../utils/sendgrid";
import AssetService from "../asset/asset.service";
import Folder from "../folder/folder.model";
import Cloudinary from "../integration/cloudinary/cloudinary.model";
import Notification from "../notification/notification.model";
import Section from "../planner/section/section.model";
import Task from "../planner/task/task.model";
import Blogger from "../platform/blogger/blogger.model";
import DevTo from "../platform/devto/devto.model";
import Ghost from "../platform/ghost/ghost.model";
import Hashnode from "../platform/hashnode/hashnode.model";
import Medium from "../platform/medium/medium.model";
import Platform from "../platform/platform.model";
import Wordpress from "../platform/wordpress/wordpress.model";
import Post from "../post/post.model";
import Project from "../project/project.model";
import Subscription from "../subscription/subscription.model";
import User from "../user/user.model";
import type { IUser } from "../user/user.types";

export default class AdminController {
  async sendTosNoticeHandler() {
    try {
      const users = await User.find({}).exec();
      const sendAt = Math.floor(Date.now() / 1000);

      await sgMail.send({
        from: process.env.FROM_EMAIL_AUTO,
        isMultiple: true,
        templateId: EmailTemplate.TOS_NOTICE,
        personalizations: users.map((user, i) => ({
          to: [{ email: user.email }],
          dynamicTemplateData: {
            first_name: user.first_name,
            email: user.email,
          },
          sendAt: sendAt + i * 60, // 1 minute after the previous email
        })),
      });

      return { success: true };
    } catch (error) {
      await logtail.error(JSON.stringify(error));

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: defaultConfig.defaultErrorMessage,
      });
    }
  }

  async getInactiveUsersHandler(): Promise<
    Pick<IUser, "email" | "_id" | "user_type" | "last_login">[]
  > {
    try {
      return await User.find({
        last_login: {
          $lt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * 3),
        },
        user_type: UserType.FREE,
      })
        .select("email _id user_type last_login")
        .exec();
    } catch (error) {
      await logtail.error(JSON.stringify(error));

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while fetching the user. Please try again later.",
      });
    }
  }

  // Delete inactive users and their associated data
  async deleteInactiveUsersHandler() {
    const session = await mongoose.startSession();

    try {
      const users = await this.getInactiveUsersHandler();
      const userIds = users.map((user) => user._id);

      await session.withTransaction(async () => {
        // Perform all database deletions in parallel
        const deleteOperations = [
          Blogger.deleteMany({ user_id: { $in: userIds } }, { session }),
          Cloudinary.deleteMany({ user_id: { $in: userIds } }, { session }),
          DevTo.deleteMany({ user_id: { $in: userIds } }, { session }),
          Ghost.deleteMany({ user_id: { $in: userIds } }, { session }),
          Hashnode.deleteMany({ user_id: { $in: userIds } }, { session }),
          Medium.deleteMany({ user_id: { $in: userIds } }, { session }),
          Wordpress.deleteMany({ user_id: { $in: userIds } }, { session }),
          Folder.deleteMany({ user_id: { $in: userIds } }, { session }),
          Notification.deleteMany({ user_id: { $in: userIds } }, { session }),
          Platform.deleteMany({ user_id: { $in: userIds } }, { session }),
          Post.deleteMany({ user_id: { $in: userIds } }, { session }),
          Project.deleteMany({ user_id: { $in: userIds } }, { session }),
          Section.deleteMany({ user_id: { $in: userIds } }, { session }),
          Subscription.deleteMany({ user_id: { $in: userIds } }, { session }),
          Task.deleteMany({ user_id: { $in: userIds } }, { session }),
          // Delete users last
          User.deleteMany({ _id: { $in: userIds } }, { session }),
        ];

        await Promise.all(deleteOperations);
      });

      // Process external services in batches
      const BATCH_SIZE = 100;
      for (let i = 0; i < users.length; i += BATCH_SIZE) {
        const batch = users.slice(i, i + BATCH_SIZE);
        await Promise.all([
          // Delete assets
          ...batch.map((user) =>
            new AssetService().deleteAssetsByUserId(user._id),
          ),
          // Clear Redis
          ...batch.map((user) => redisClient.del(String(user._id))),
        ]);
      }
    } catch (error) {
      await logtail.error("Delete inactive users failed", {
        error: JSON.stringify(error),
      });
      console.log(error);

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An error occurred while deleting the users. Please try again later.",
      });
    } finally {
      await session.endSession();
    }
  }
}
