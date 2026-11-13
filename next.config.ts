import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pia.bconz.com is the PIA app; its copies of public pages belong on www.
  async redirects() {
    return [
      {
        source: "/:path((?!pia|api|_next)[^.]+)",
        has: [{ type: "host", value: "pia.bconz.com" }],
        destination: "https://www.bconz.com/:path",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/pia/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        // Partner preview images, shown on the request page only; keep them out of search and image results.
        source: "/previews/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, noimageindex" }],
      },
    ];
  },
};

export default nextConfig;
