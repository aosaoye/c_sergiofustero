import type { NextConfig } from "next";

const isGithubPages =
  process.env.GITHUB_ACTIONS === "true" ||
  process.env.STATIC_EXPORT === "true";
const basePath = isGithubPages ? "/c_sergiofustero" : "";

const nextConfig: NextConfig = {
  ...(isGithubPages
    ? {
        output: "export" as const,
        basePath,
        trailingSlash: true,
        images: {
          unoptimized: true,
        },
        env: {
          NEXT_PUBLIC_BASE_PATH: basePath,
        },
      }
    : {
        cacheComponents: true,
        partialPrefetching: true,
        experimental: {
          agentFeedback: true,
        },
      }),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
