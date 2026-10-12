import type { NextConfig } from "next";

const htmlRedirects = [
  "contact",
  "services",
  "realisations",
  "services/site-web",
  "services/ui-ux",
  "services/seo",
  "services/refonte",
  "realisations/veillee",
  "realisations/alric",
  "realisations/vauclair",
  "realisations/sublimessence",
  "realisations/lacets",
] as const;

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      ...htmlRedirects.map((p) => ({
        source: `/${p}.html`,
        destination: `/${p}`,
        permanent: true,
      })),
    ];
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
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
