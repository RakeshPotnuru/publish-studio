interface ISiteConfig {
    title: string;
    description: string;
    url: string;
    theme?: {
        color: `#${string}`;
    };
}

export const siteConfig: ISiteConfig = {
    title: "Publish Studio",
    description:
        "Publish Studio is an all-in-one platform to curate content and publish to different platforms.",
    url: "https://app.publishstudio.one",
    theme: {
        color: "#EB5757",
    },
};
