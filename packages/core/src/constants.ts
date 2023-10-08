/* Platform name must match model name. */
enum platforms {
    HASHNODE = "Hashnode",
    DEVTO = "DevTo",
    MEDIUM = "Medium",
}

enum projectStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
}

export const project = {
    title: {
        MIN_LENGTH: 3,
        MAX_LENGTH: 120,
    },
    description: {
        MAX_LENGTH: 500,
    },
    body: {
        MAX_LENGTH: 100_000,
    },
    tags: {
        tag: { MAX_LENGTH: 25 },
        MAX_LENGTH: 5,
    },
    status: projectStatus,
} as const;

export const folder = {
    name: {
        MIN_LENGTH: 3,
        MAX_LENGTH: 160,
    },
} as const;

enum userTypes {
    FREE = "free",
    PRO = "pro",
}

enum authModes {
    CLASSIC = "classic",
    GOOGLE = "google",
}

export const user = {
    firstName: {
        MIN_LENGTH: 3,
        MAX_LENGTH: 25,
    },
    lastName: {
        MIN_LENGTH: 3,
        MAX_LENGTH: 25,
    },
    password: {
        MIN_LENGTH: 8,
    },
    userTypes: userTypes,
    platforms: platforms,
    authModes: authModes,
} as const;

export const rabbitmq = {
    queues: {
        POSTS: "posts",
        POST_JOBS: "post_jobs",
        EMAILS: "emails",
        EMAIL_JOBS: "email_jobs",
    },
};

export enum emailTemplates {
    VERIFY_EMAIL = "ps_verify_email",
    RESET_PASSWORD = "ps_reset_password",
    WELCOME_EMAIL = "ps_welcome_email",
}

export const payment = {
    plans: {
        proMonthly: {
            PRICE_IN_CENTS: 799,
            PRICE_IN_DOLLARS: 7.99,
            PRICE_ID: "price_1NjGYWSEoLcIwk4mKMkjgvoZ",
        },
    },
    CURRENCY: "usd",
};