/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "publish-studio.s3.ap-south-1.amazonaws.com",
            },
            {
                protocol: "https",
                hostname: "images.pexels.com",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
        ],
    },
    webpack: config => {
        config.resolve.fallback = {
            "mongodb-client-encryption": false,
            aws4: false,
        };

        return config;
    },
};

module.exports = nextConfig;
