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
    mediumAPIKeyGuide: `${docsDomain}/connections/platforms/medium#how-to-get-api-key`,
    hashnodeAPIKeyGuide: `${docsDomain}/connections/platforms/hashnode#how-to-get-api-key`,
    ghostAPIKeyGuide: `${docsDomain}/connections/platforms/ghost#how-to-get-api-key-and-api-url`,
    cloudinaryAPIKeyGuide: `${docsDomain}/connections/integrations/cloudinary#how-to-get-api-key-and-cloud-name`,
    apiKeysSecureStorage: `${docsDomain}/connections#will-my-credentials-be-safe`,
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
    googleConnectedApps: "https://myaccount.google.com/connections",
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
    dashboard: {
      title: "Dashboard",
      description: "Dashboard",
      link: "/",
    },
  },
};
