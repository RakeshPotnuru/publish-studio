import type { Job } from "bullmq";
import { Worker } from "bullmq";

import { bullMQConnectionOptions } from "../config/app.config";
import type { EmailTemplate } from "../config/constants";
import { constants } from "../config/constants";
import type { ISchedule } from "../modules/post/post.types";
import PublishService from "../modules/post/publish/publish.service";
import type { IEmail } from "./aws/ses";
import { sendEmail } from "./aws/ses";
import { logtail } from "./logtail";

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
    logtail.error(JSON.stringify(error)).catch(() => console.log("Error logging post job error"));
});

const emailWorker = new Worker<IEmail, IEmail>(
    constants.bullmq.queues.EMAIL,
    async (job: Job) => {
        await sendEmail(
            job.data.emails as string[],
            job.data.template as EmailTemplate,
            job.data.variables as Record<string, string>,
            job.data.from_address as string,
        );

        return job.data as IEmail;
    },
    {
        connection: bullMQConnectionOptions,
        removeOnComplete: { count: 0 },
        removeOnFail: { count: 0 },
    },
);

emailWorker.on("failed", job => {
    logtail
        .error(job?.failedReason ?? "Email job failed due to unknown reason")
        .catch(() => console.log("Error logging failed email job"));
});

emailWorker.on("error", error => {
    logtail.error(JSON.stringify(error)).catch(() => console.log("Error logging email job error"));
});