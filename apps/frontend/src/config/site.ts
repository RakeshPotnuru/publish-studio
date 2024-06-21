const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const siteConfig = {
  title: "Publish Studio",
  description:
    "The Ultimate Platform for Seamless Content Curation and Distribution. All in One Place.",
  url: defaultUrl,
  theme: {
    color: "#EB5757",
  },
  links: {
    devAPIKeyGuide: "https://pbst.link/dev-api-key",
    mediumAPIKeyGuide: "https://pbst.link/medium-api-key",
    hashnodeAPIKeyGuide: "https://pbst.link/hsnode-api-key",
    ghostAPIKeyGuide: "https://pbst.link/ghost-api-key",
    cloudinaryAPIKeyGuide: "https://pbst.link/cldnry-api-key",
    apiKeysSecureStorage: "https://pbst.link/creds-secure",
    devTags: "https://pbst.link/dev-tags",
    mediumTags: "https://pbst.link/medium-tags",
    ghostTags: "https://pbst.link/ghost-tags",
    wordpressTags: "https://pbst.link/wp-tags",
    bloggerLabels: "https://pbst.link/blogger-labels",
    support: "mailto:support@publishstudio.one",
    docs: "https://pbst.link/docs",
    wordpressAuthorize: "https://pbst.link/wp-authorize",
    wordpressConnectedApps: "https://pbst.link/wp-cntd-apps",
    googleConnectedApps: "https://pbst.link/google-3rd-apps",
    pricing: "https://publishstudio.one/pricing",
    privacyPolicy: "https://pbst.link/privacy",
    termsOfService: "https://pbst.link/tos",
    bugReport: "https://pbst.link/bug-report",
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
      description: "Find your Assets",
      link: "/assets",
    },
    folders: {
      title: "Folders",
      description: "Find your Folders",
      link: "/folders",
    },
    projects: {
      title: "Projects",
      description: "Find your Projects",
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
      security: {
        title: "Security",
        description: "Manage your account security settings",
        link: "/settings/security",
      },
    },
    planner: {
      title: "Content Planner",
      description:
        "Quickly jot down your content ideas, track your work and plan your content calendar.",
      link: "/planner",
    },
    paymentSuccess: {
      title: "Payment Success",
      description: "Your payment was successfully processed.",
      link: "/payment-success",
    },
  },
};
