import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Photos the editor uploads to Storyblok are served from its asset host, and
    // next/image refuses any host it has not been told about. The space's own
    // folder only, so another account's pictures cannot be run through us. The
    // bucket's Amazon address is the one the site reads (see assetHost.ts): the
    // CDN host does not answer from every network.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.amazonaws.com",
        pathname: process.env.STORYBLOK_SPACE_ID
          ? `/a.storyblok.com/f/${process.env.STORYBLOK_SPACE_ID}/**`
          : "/a.storyblok.com/f/**",
      },
      {
        protocol: "https",
        hostname: "a.storyblok.com",
        pathname: process.env.STORYBLOK_SPACE_ID
          ? `/f/${process.env.STORYBLOK_SPACE_ID}/**`
          : "/f/**",
      },
    ],
  },

  async redirects() {
    // The file's cookie informer links to /cookie; the policy itself lives at
    // /cookies, where the footer and the notice already point. The old address
    // is kept as an alias rather than moving the page, which would mean
    // renaming its story in Storyblok.
    return [
      { source: "/cookie", destination: "/cookies", permanent: true },
      { source: "/:locale(ru_ru|ru_am)/cookie", destination: "/:locale/cookies", permanent: true },
    ];
  },
};

export default nextConfig;
