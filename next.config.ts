import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Photos the editor uploads to Storyblok are served from its asset host, and
    // next/image refuses any host it has not been told about. The space's own
    // folder only, so another account's pictures cannot be run through us.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "a.storyblok.com",
        pathname: process.env.STORYBLOK_SPACE_ID
          ? `/f/${process.env.STORYBLOK_SPACE_ID}/**`
          : "/f/**",
      },
    ],
  },
};

export default nextConfig;
