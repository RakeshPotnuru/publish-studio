import { TRPCError } from "@trpc/server";
import type { Job } from "bullmq";
import { Queue, Worker } from "bullmq";

import { bullMQConnectionOptions } from "../../../config/app.config";
import { constants, Platform } from "../../../config/constants";
import { logtail } from "../../../utils/logtail";
import BloggerController from "../../platform/blogger/blogger.controller";
import DevToController from "../../platform/devto/devto.controller";
import GhostController from "../../platform/ghost/ghost.controller";
import HashnodeController from "../../platform/hashnode/hashnode.controller";
import MediumController from "../../platform/medium/medium.controller";
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

            await postQueue.add(
                `${constants.bullmq.queues.POST}-job-${data.project._id.toString()}`,
                data,
                {
                    delay,
                },
            );
            await postQueue.trimEvents(10);

            const postWorker = new Worker<ISchedule, ISchedule>(
                constants.bullmq.queues.POST,
                async (job: Job): Promise<ISchedule> => {
                    const data = job.data as ISchedule;
                    const publishService = new PublishService();
                    await publishService.publishPost(data.platforms, data.project, data.user_id);

                    return job.data as ISchedule;
                },
                {
                    connection: bullMQConnectionOptions,
                    removeOnComplete: { count: 0 },
                    removeOnFail: { count: 0 },
                },
            );

            postWorker.on("failed", job => {
                logtail
                    .error(job?.failedReason ?? "Post job failed due to unknown reason")
                    .catch(() => console.log("Error logging failed post job"));
            });

            postWorker.on("error", error => {
                logtail
                    .error(JSON.stringify(error))
                    .catch(() => console.log("Error logging post job error"));
            });
        } catch (error) {
            await logtail.error(JSON.stringify(error), {
                user_id: data.user_id,
            });

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to schedule post. Please try again later.",
            });
        }
    }

    getPlatformCreateController(
        platform: Platform,
    ):
        | DevToController
        | HashnodeController
        | MediumController
        | GhostController
        | WordPressController
        | BloggerController
        | undefined {
        switch (platform) {
            case Platform.DEVTO: {
                return new DevToController();
            }
            case Platform.HASHNODE: {
                return new HashnodeController();
            }
            case Platform.MEDIUM: {
                return new MediumController();
            }
            case Platform.GHOST: {
                return new GhostController();
            }
            case Platform.WORDPRESS: {
                return new WordPressController();
            }
            case Platform.BLOGGER: {
                return new BloggerController();
            }

            default: {
                return;
            }
        }
    }

    getPlatformUpdateController(
        platform: Platform,
    ):
        | DevToController
        | HashnodeController
        | GhostController
        | WordPressController
        | BloggerController
        | undefined {
        switch (platform) {
            case Platform.DEVTO: {
                return new DevToController();
            }
            case Platform.HASHNODE: {
                return new HashnodeController();
            }
            case Platform.GHOST: {
                return new GhostController();
            }
            case Platform.WORDPRESS: {
                return new WordPressController();
            }
            case Platform.BLOGGER: {
                return new BloggerController();
            }

            default: {
                return;
            }
        }
    }
}
