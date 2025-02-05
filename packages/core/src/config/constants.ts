const project = {
  name: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 160,
  },
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
    wordpress: {
      MAX_LENGTH: 5,
    },
    blogger: {
      MAX_LENGTH: 3,
    },
  },
  tone_analysis: {
    input: {
      MIN_LENGTH: 10,
      MAX_LENGTH: 10_000,
    },
  },
} as const;

const folder = {
  name: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 160,
  },
} as const;

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
} as const;

const bullmq = {
  queues: {
    POST: "post",
    EMAIL: "email",
  },
} as const;

const asset = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
} as const;

const AUTOSAVE_INTERVAL = 3000;

const GLOBAL_STALE_TIME = 1000 * 60 * 2;
const GLOBAL_CACHE_TIME = 1000 * 60 * 5;

const FREE_TRIAL_TIME = 7 * 24 * 60 * 60 * 1000;

const pusher = {
  events: {
    NEW_NOTIFICATION: "new-notification",
  },
};

const genAI = {
  changeTone: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 10_000,
    path: "change-tone",
  },
  shortenText: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 10_000,
    path: "shorten-text",
  },
  expandText: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 10_000,
    path: "expand-text",
  },
  numberedList: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 10_000,
    path: "numbered-list",
  },
  bulletList: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 10_000,
    path: "bullet-list",
  },
};

const planner = {
  section: {
    name: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 160,
      RESERVED: "Unassigned",
    },
    task: {
      name: {
        MIN_LENGTH: 1,
        MAX_LENGTH: 160,
      },
      description: {
        MAX_LENGTH: 5000,
      },
    },
  },
};

export const constants = {
  project,
  user,
  folder,
  bullmq,
  asset,
  AUTOSAVE_INTERVAL,
  GLOBAL_STALE_TIME,
  GLOBAL_CACHE_TIME,
  pusher,
  genAI,
  planner,
  FREE_TRIAL_TIME,
};

/* Platform name must match model name. */
export enum Platform {
  HASHNODE = "Hashnode",
  DEVTO = "DevTo",
  MEDIUM = "Medium",
  GHOST = "Ghost",
  WORDPRESS = "WordPress",
  BLOGGER = "Blogger",
}

export enum ProjectStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  SCHEDULED = "scheduled",
}

export enum PostStatus {
  SUCCESS = "success",
  ERROR = "error",
  PENDING = "pending",
}

export enum Sentiment {
  POSITIVE = "positive",
  NEGATIVE = "negative",
  NEUTRAL = "neutral",
}

export enum UserType {
  FREE = "free",
  PRO = "pro",
}

export enum AuthMode {
  CLASSIC = "classic",
  GOOGLE = "google",
}

export enum EmailTemplate {
  VERIFY_EMAIL = "d-8272913d7ea145109ebe45015dcecc41",
  RESET_PASSWORD = "d-e90b0f1810764e9295e964acb83c283d",
  WELCOME_EMAIL = "d-b5a3601a35df449ca51440b7c02bbdf2",
  INVITE = "d-a40273604e3449b7ac63530cf5a8c6f9",
  TOS_NOTICE = "d-c339efbe05bf4498a32562397b174f5d",
}

export enum MimeType {
  PNG = "image/png",
  JPG = "image/jpg",
  JPEG = "image/jpeg",
  SVG = "image/svg+xml",
  GIF = "image/gif",
}

export enum ErrorCause {
  VERIFICATION_PENDING = "verification_pending",
}

export enum MediumStatus {
  PUBLIC = "public",
  UNLISTED = "unlisted",
  DRAFT = "draft",
}

export enum GhostStatus {
  PUBLISHED = "published",
  DRAFT = "draft",
}

export enum WordPressStatus {
  PUBLISH = "publish",
  PRIVATE = "private",
  DRAFT = "draft",
  PENDING = "pending",
}

export enum TextTone {
  FORMAL = "formal",
  INFORMAL = "informal",
  FRIENDLY = "friendly",
  PROFESSIONAL = "professional",
}
