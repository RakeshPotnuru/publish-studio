const docsDomain = "https://docs.publishstudio.one";

export const siteConfig = {
  title: "Publish Studio",
  description:
    "Publish Studio is an all-in-one platform to curate content and publish to different platforms.",
  url: "https://app.publishstudio.one",
  theme: {
    color: "#EB5757",
  },
  links: {
    devAPIKeyGuide: `${docsDomain}/connections/platforms/dev#how-to-get-api-key`,
    mediumAPIKeyGuide: `${docsDomain}/connections/platforms/dev#how-to-get-api-key`,
    hashnodeAPIKeyGuide: `${docsDomain}/connections/platforms/dev#how-to-get-api-key`,
    ghostAPIKeyGuide: `${docsDomain}/connections/platforms/dev#how-to-get-api-key`,
    cloudinaryAPIKeyGuide: `${docsDomain}/connections/platforms/dev#how-to-get-api-key`,
    apiKeysSecureStorage:
      "https://docs.publishstudio.one/platforms#secure-storage-of-api-keys",
    devTags: "https://dev.to/tags",
    mediumTags: "https://medium.com/topics",
    ghostTags: "https://ghost.org/help/tags/",
    wordpressTags: "https://wordpress.com/support/posts/tags/",
    bloggerLabels:
      "https://support.google.com/blogger/answer/154172?visit_id=638407487949946224-3277732177&rd=1#:~:text=Add%20labels%20to,find%20your%20labels.",
    support: "mailto:support@publishstudio.one",
    wordpressAuthorize: "https://public-api.wordpress.com/oauth2/authorize",
    wordpressConnectedApps:
      "https://wordpress.com/me/security/connected-applications",
    pricing: "https://publishstudio.one/pricing",
    privacyPolicy: "https://publishstudio.one/privacy-policy",
    termsOfService: "https://publishstudio.one/terms-of-service",
  },
  twitter: {
    site: "@publishstudio",
    creator: "@rakesh_at_tweet",
  },
  pages: {
    login: {
      title: "Login",
      description: "Login to Publish Studio",
      link: "/login",
    },
    register: {
      title: "Register",
      description: "Register on Publish Studio",
      link: "/register",
    },
    resetPassword: {
      title: "Reset Password",
      description: "Reset your password",
      link: "/reset-password",
    },
    verifyEmail: {
      title: "Verify Email",
      description: "Verify your email",
      link: "/verify-email",
    },
    dashboard: {
      title: "Dashboard",
      description: "Dashboard",
      link: "/",
    },
    assets: {
      title: "Assets",
      description: "Assets",
      link: "/assets",
    },
    folders: {
      title: "Folders",
      description: "Folders",
      link: "/folders",
    },
    projects: {
      title: "Projects",
      description: "Projects",
      link: "/projects",
    },
    profile: {
      title: "Profile",
      description: "Profile",
      link: "/profile",
    },
    settings: {
      title: "Settings",
      description: "Settings",
      link: "/settings",
      appearance: {
        title: "Appearance",
        description: "Configure your appearance settings",
        link: "/settings/appearance",
      },
      connections: {
        title: "Connections",
        description: "Configure your connections",
        link: "/settings/connections",
      },
    },
  },
};
