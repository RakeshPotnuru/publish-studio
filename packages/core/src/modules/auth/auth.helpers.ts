import { TRPCError } from "@trpc/server";
import type { Job } from "bullmq";
import { Queue, Worker } from "bullmq";

import defaultConfig, { bullMQConnectionOptions } from "../../config/app";
import { constants, UserType } from "../../config/constants";
import { logtail } from "../../utils/logtail";
import type { IUser } from "../user/user.types";
import AuthService from "./auth.service";

export default class AuthHelpers extends AuthService {
  private userQueue: Queue;
  private userWorker: Worker;

  constructor() {
    super();
    this.userQueue = this.initializeQueue();
    this.userWorker = this.initializeWorker();
  }

  private initializeQueue(): Queue {
    const queue = new Queue(constants.bullmq.queues.USER, {
      connection: bullMQConnectionOptions,
    });

    queue.on("error", (error) => {
      logtail.error(`User queue error: ${JSON.stringify(error)}`).catch(() => {
        console.error("Error logging user queue error");
      });
    });

    return queue;
  }

  private initializeWorker(): Worker {
    const worker = new Worker<IUser, void>(
      constants.bullmq.queues.USER,
      async (job: Job<IUser>): Promise<void> => {
        const user = job.data;
        try {
          await this.updateUser(user._id, {
            user_type: UserType.FREE,
          });
        } catch (error) {
          logtail
            .error(`Error updating user: ${JSON.stringify(error)}`, {
              user_id: user._id,
            })
            .catch(() => {
              console.error("Error logging user update error");
            });
          throw error; // Re-throw to mark job as failed
        }
      },
      {
        connection: bullMQConnectionOptions,
        removeOnComplete: { count: 0 },
        removeOnFail: { count: 0 },
      },
    );

    worker.on("failed", (job, error) => {
      logtail
        .error(`User job failed: ${error.message}`, { job_id: job?.id })
        .catch(() => {
          console.error("Error logging failed user job");
        });
    });

    worker.on("error", (error) => {
      logtail.error(`User worker error: ${JSON.stringify(error)}`).catch(() => {
        console.error("Error logging user worker error");
      });
    });

    return worker;
  }

  async startFreeTrial(user: IUser, customDelay?: number): Promise<void> {
    try {
      const now = Date.now();
      const delay =
        customDelay ??
        Number(new Date(user.created_at)) + constants.FREE_TRIAL_TIME - now;

      if (!customDelay && delay <= 0) {
        throw new Error("Free trial period has already ended");
      }

      await this.userQueue.add(
        `${constants.bullmq.queues.USER}-job-${user._id.toString()}`,
        user,
        {
          delay,
          removeOnComplete: { count: 0 },
          removeOnFail: { count: 0 },
        },
      );

      const TRIM_EVENTS_COUNT = 10; // Define as a constant
      await this.userQueue.trimEvents(TRIM_EVENTS_COUNT);
    } catch (error) {
      await logtail.error(
        `Error starting free trial: ${JSON.stringify(error)}`,
        {
          user_id: user._id,
        },
      );

      console.error(error);

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: defaultConfig.defaultErrorMessage,
      });
    }
  }

  // New utility methods

  async pauseWorker(): Promise<void> {
    await this.userWorker.pause();
  }

  resumeWorker(): void {
    this.userWorker.resume();
  }

  async closeQueueAndWorker(): Promise<void> {
    await this.userQueue.close();
    await this.userWorker.close();
  }

  getWorkerStatus(): string {
    return this.userWorker.isPaused() ? "paused" : "active";
  }
}
