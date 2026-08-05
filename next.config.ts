import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/images/brand/:path*",
        destination: "/Images/brand_canvas/:path*",
      },
      {
        source: "/images/brand/bconz-icon.png",
        destination: "/brand/bconz-mark.svg",
      },
    ];
  },
};

export default nextConfig;
