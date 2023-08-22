export const rabbitmq = {
    queues: {
        POSTS: "posts",
        POST_JOBS: "post_jobs",
        EMAILS: "emails",
        EMAIL_JOBS: "email_jobs",
    },
};

export const bullmq = {
    queues: {
        POST: "post",
        EMAIL: "email",
    },
};

export enum emailTemplates {
    VERIFY_EMAIL = "ps_verify_email",
    RESET_PASSWORD = "ps_reset_password",
    WELCOME_EMAIL = "ps_welcome_email",
}
