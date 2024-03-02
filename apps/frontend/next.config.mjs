const cspHeader = `
default-src 'self';
connect-src 'self' ${process.env.NEXT_PUBLIC_CORE_URL} ${process.env.NEXT_PUBLIC_WEBSOCKET_URL} ${process.env.NEXT_PUBLIC_R2_BUCKET_URL} https://accounts.google.com;
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

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      aws4: false,
    };

    return config;
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "same-origin",
          },
          {
            key: "Permissions-Policy",
            value: "geolocation=(), microphone=(self), camera=()",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },
    ];
  },
};

export default nextConfig;