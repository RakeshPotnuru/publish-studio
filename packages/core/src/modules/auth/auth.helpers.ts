import { TRPCError } from "@trpc/server";
import type { Job } from "bullmq";
import { Queue, Worker } from "bullmq";

import defaultConfig, { bullMQConnectionOptions } from "../../config/app";
import { constants, UserType } from "../../config/constants";
import { logtail } from "../../utils/logtail";
import type { IUser } from "../user/user.types";
import AuthService from "./auth.service";

export default class AuthHelpers extends AuthService {
  async startFreeTrial(user: IUser, customDelay?: number) {
    try {
      const userQueue = new Queue(constants.bullmq.queues.USER, {
        connection: bullMQConnectionOptions,
      });

      const delay =
        Number(new Date(user.created_at)) +
        constants.FREE_TRIAL_TIME -
        Date.now(); // 7 days from created_at

      await userQueue.add(
        `${constants.bullmq.queues.USER}-job-${user._id.toString()}`,
        user,
        {
          delay: customDelay ?? delay,
          removeOnComplete: { count: 0 },
          removeOnFail: { count: 0 },
        },
      );
      await userQueue.trimEvents(10);

      userQueue.on("error", (error) => {
        logtail
          .error(JSON.stringify(error))
          .catch(() => console.log("Error logging user queue error"));
      });

      const userWorker = new Worker<IUser, IUser>(
        constants.bullmq.queues.USER,
        async (job: Job): Promise<IUser> => {
          const user = job.data as IUser;

          await super.updateUser(user._id, {
            user_type: UserType.FREE,
          });

          return user;
        },
        {
          connection: bullMQConnectionOptions,
          removeOnComplete: { count: 0 },
          removeOnFail: { count: 0 },
        },
      );

      userWorker.on("failed", (job) => {
        logtail
          .error(job?.failedReason ?? "User job failed due to unknown reason")
          .catch(() => console.log("Error logging failed user job"));
      });

      userWorker.on("error", (error) => {
        logtail
          .error(JSON.stringify(error))
          .catch(() => console.log("Error logging user job error"));
      });
    } catch (error) {
      await logtail.error(JSON.stringify(error), {
        user_id: user._id,
      });

      console.log("Error starting free trial", error);

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: defaultConfig.defaultErrorMessage,
      });
    }
  }
}
