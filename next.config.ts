import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Optimize images from the public directory */
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
