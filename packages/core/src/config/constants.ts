/* Platform name must match model name. */
enum platforms {
    HASHNODE = "Hashnode",
    DEVTO = "DevTo",
    MEDIUM = "Medium",
    GHOST = "Ghost",
    WORDPRESS = "WordPress",
}

enum projectStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    SCHEDULED = "scheduled",
}

enum platformPublishStatuses {
    SUCCESS = "success",
    ERROR = "error",
    PENDING = "pending",
}

enum sentiments {
    POSITIVE = "positive",
    NEGATIVE = "negative",
    NEUTRAL = "neutral",
}

const project = {
    title: {
        MIN_LENGTH: 3,
        MAX_LENGTH: 120,
        RECOMMENDED_MIN_LENGTH: 50,
        RECOMMENDED_MAX_LENGTH: 60,
    },
    description: {
        MAX_LENGTH: 500,
        RECOMMENDED_MIN_LENGTH: 120,
        RECOMMENDED_MAX_LENGTH: 160,
    },
    body: {
        MAX_LENGTH: 100_000,
    },
    tags: {
        tag: { MAX_LENGTH: 25 },
        dev: {
            MAX_LENGTH: 4,
        },
        medium: {
            MAX_LENGTH: 5,
        },
        hashnode: {
            MAX_LENGTH: 5,
        },
        ghost: {
            MAX_LENGTH: 5,
        },
    },
    status: projectStatus,
    platformPublishStatuses,
    tone_analysis: {
        input: {
            MIN_LENGTH: 10,
            MAX_LENGTH: 10_000,
        },
        sentiments,
    },
} as const;

const folder = {
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

const user = {
    firstName: {
        MIN_LENGTH: 1,
        MAX_LENGTH: 25,
    },
    lastName: {
        MIN_LENGTH: 1,
        MAX_LENGTH: 25,
    },
    password: {
        MIN_LENGTH: 8,
    },
    userTypes: userTypes,
    platforms: platforms,
    authModes: authModes,
} as const;

const bullmq = {
    queues: {
        POST: "post",
        EMAIL: "email",
    },
} as const;

enum emailTemplates {
    VERIFY_EMAIL = "ps_verify_email",
    RESET_PASSWORD = "ps_reset_password",
    WELCOME_EMAIL = "ps_welcome_email",
}

const payment = {
    plans: {
        proMonthly: {
            PRICE_IN_CENTS: 799,
            PRICE_IN_DOLLARS: 7.99,
            PRICE_ID: "price_1NjGYWSEoLcIwk4mKMkjgvoZ",
        },
    },
    CURRENCY: "usd",
};

enum mimeTypes {
    PNG = "image/png",
    JPG = "image/jpg",
    JPEG = "image/jpeg",
    SVG = "image/svg+xml",
    GIF = "image/gif",
}

const asset = {
    ALLOWED_MIMETYPES: mimeTypes,
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
} as const;

const errorCauses = {
    VERIFICATION_PENDING: "verification_pending",
};

enum mediumStatuses {
    PUBLIC = "public",
    UNLISTED = "unlisted",
    DRAFT = "draft",
}

enum ghostStatuses {
    PUBLISHED = "published",
    DRAFT = "draft",
}

export const constants = {
    project,
    user,
    folder,
    bullmq,
    payment,
    emailTemplates,
    asset,
    errorCauses,
    mediumStatuses,
    ghostStatuses,
};
