/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
    webpack: config => {
        config.resolve.fallback = {
            aws4: false,
        };

        return config;
    },
};

module.exports = nextConfig;
