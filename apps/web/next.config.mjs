const cspHeader = `
default-src 'self';
connect-src 'self' ${process.env.NEXT_PUBLIC_CORE_URL};
script-src 'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com;
frame-src 'self' https://challenges.cloudflare.com;
style-src 'self' 'unsafe-inline';
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
            value: "geolocation=(), microphone=(), camera=()",
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
