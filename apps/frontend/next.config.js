/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "loremflickr.com",
            },
            {
                protocol: "https",
                hostname: "picsum.photos",
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
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
