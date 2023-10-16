interface ISiteConfig {
    title: string;
    description: string;
    url: string;
    theme?: {
        color: `#${string}`;
    };
    links: {
        [key: string]: string;
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
    links: {
        devAPIKeyGuide: "https://docs.publishstudio.one/platforms/dev#api-key",
        mediumAPIKeyGuide: "https://docs.publishstudio.one/platforms/medium#api-key",
        hashnodeAPIKeyGuide: "https://docs.publishstudio.one/platforms/hashnode#api-key",
        apiKeysSecureStorage: "https://docs.publishstudio.one/platforms#secure-storage-of-api-keys",
    },
};
