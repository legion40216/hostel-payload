import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // This allows Cloudinary images
        pathname: "/dk4dmtgci/**",      // Your specific Cloudinary name
      },
    ],
  },
};

export default withPayload(nextConfig);