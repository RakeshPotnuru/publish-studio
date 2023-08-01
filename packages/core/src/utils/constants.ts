enum platforms {
    HASHNODE = "hashnode",
    DEVTO = "devto",
    MEDIUM = "medium",
    DEFAULT = "default",
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
        MAX_LENGTH: 50,
    },
    status: projectStatus,
    platforms: platforms,
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
} as const;
