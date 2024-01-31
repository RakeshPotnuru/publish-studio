import { TRPCError } from "@trpc/server";
import type { Job } from "bullmq";
import { Queue, Worker } from "bullmq";

import { bullMQConnectionOptions } from "../../../config/app.config";
import { constants } from "../../../config/constants";
import BloggerController from "../../platform/blogger/blogger.controller";
import DevToController from "../../platform/devto/devto.controller";
import GhostController from "../../platform/ghost/ghost.controller";
import HashnodeController from "../../platform/hashnode/hashnode.controller";
import MediumController from "../../platform/medium/medium.controller";
import type { TPlatformName } from "../../platform/platform.types";
import WordPressController from "../../platform/wordpress/wordpress.controller";
import type { ISchedule } from "../post.types";
import PublishService from "./publish.service";

export default class PublishHelpers extends PublishService {
    async schedulePost(data: ISchedule) {
        try {
            const postQueue = new Queue(constants.bullmq.queues.POST, {
                connection: bullMQConnectionOptions,
            });

            const delay = Number(new Date(data.scheduled_at)) - Date.now();
            console.log(`⏰ Sending post in ${delay}ms`);

            await postQueue.add(
                `${constants.bullmq.queues.POST}-job-${data.project._id.toString()}`,
                data,
                {
                    delay,
                },
            );

            this.startSchedulePostWorker();
        } catch (error) {
            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to schedule post. Please try again later.",
            });
        }
    }

    startSchedulePostWorker() {
        try {
            const worker = new Worker<ISchedule, ISchedule>(
                constants.bullmq.queues.POST,
                async (job: Job): Promise<ISchedule> => {
                    const data = job.data as ISchedule;

                    await super.publishPost(data.platforms, data.project, data.user_id);

                    console.log(`✅ Sent post ${job.id ?? ""} at ${data.scheduled_at.toString()}`);

                    return job.data as ISchedule;
                },
                { connection: bullMQConnectionOptions },
            );

            worker.on("completed", job => {
                void job.remove();
                console.log(`✅ Completed scheduled post ${job.id ?? ""}`);
            });

            worker.on("failed", job => {
                console.log(job?.failedReason);

                console.log("❌ Job Failed");
            });

            worker.on("error", error => {
                console.log(error);
            });
        } catch (error) {
            console.log("❌ Failed to start schedule post worker");

            console.log(error);

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to schedule post. Please try again later.",
            });
        }
    }

    getPlatformCreateController(
        platform: TPlatformName,
    ):
        | DevToController
        | HashnodeController
        | MediumController
        | GhostController
        | WordPressController
        | BloggerController
        | undefined {
        switch (platform) {
            case constants.user.platforms.DEVTO: {
                return new DevToController();
            }
            case constants.user.platforms.HASHNODE: {
                return new HashnodeController();
            }
            case constants.user.platforms.MEDIUM: {
                return new MediumController();
            }
            case constants.user.platforms.GHOST: {
                return new GhostController();
            }
            case constants.user.platforms.WORDPRESS: {
                return new WordPressController();
            }
            case constants.user.platforms.BLOGGER: {
                return new BloggerController();
            }

            default: {
                return;
            }
        }
    }

    getPlatformUpdateController(
        platform: TPlatformName,
    ):
        | DevToController
        | HashnodeController
        | GhostController
        | WordPressController
        | BloggerController
        | undefined {
        switch (platform) {
            case constants.user.platforms.DEVTO: {
                return new DevToController();
            }
            case constants.user.platforms.HASHNODE: {
                return new HashnodeController();
            }
            case constants.user.platforms.GHOST: {
                return new GhostController();
            }
            case constants.user.platforms.WORDPRESS: {
                return new WordPressController();
            }
            case constants.user.platforms.BLOGGER: {
                return new BloggerController();
            }

            default: {
                return;
            }
        }
    }
}
