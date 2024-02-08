/** @type {import('next').NextConfig} */

const cspHeader = `
    default-src 'self';
    connect-src 'self' ${process.env.NEXT_PUBLIC_CORE_URL} ${process.env.NEXT_PUBLIC_WEBSOCKET_URL} https://accounts.google.com;
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com https://accounts.google.com https://media-library.cloudinary.com;
    frame-src 'self' https://challenges.cloudflare.com https://accounts.google.com https://eml.imagekit.io https://media-library.cloudinary.com https://console.cloudinary.com;
    style-src 'self' 'unsafe-inline' https://accounts.google.com;
    img-src * blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
`;

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "publish-studio.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      aws4: false,
    };

    return config;
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
