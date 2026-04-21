import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.*", "localhost"],
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
