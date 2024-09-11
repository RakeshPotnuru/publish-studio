const paddleCdn =
  process.env.NEXT_PUBLIC_SITE_ENV === "production" ? "cdn" : "sandbox-cdn";
const paddleBuy =
  process.env.NEXT_PUBLIC_SITE_ENV === "production" ? "buy" : "sandbox-buy";

const cspHeader = `
default-src 'self';
connect-src 'self' ${process.env.NEXT_PUBLIC_CORE_URL} ${process.env.NEXT_PUBLIC_R2_BUCKET_URL} ${process.env.NEXT_PUBLIC_POSTHOG_HOST} https://sockjs-ap2.pusher.com wss://ws-ap2.pusher.com https://accounts.google.com/gsi/ https://images.unsplash.com https://images.pexels.com https://ik.imagekit.io https://api.giphy.com;
script-src 'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com https://accounts.google.com/gsi/client https://media-library.cloudinary.com https://us-assets.i.posthog.com https://cdn.paddle.com https://public.profitwell.com;
frame-src 'self' https://challenges.cloudflare.com https://accounts.google.com/gsi/ https://eml.imagekit.io https://media-library.cloudinary.com https://console.cloudinary.com https://${paddleBuy}.paddle.com/;
style-src 'self' 'unsafe-inline' https://accounts.google.com/gsi/style https://${paddleCdn}.paddle.com;
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
  transpilePackages: ["highlight.js"],
};

export default nextConfig;
