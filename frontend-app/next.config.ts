import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.maps.ls.hereapi.com",
      },
    ],
  },
};

export default nextConfig;
