import type { NextConfig } from "next";

const buildRemotePatterns = () => {
  const defaults: Array<{
    protocol: "http" | "https";
    hostname: string;
    pathname: string;
  }> = [
    {
      protocol: "https",
      hostname: "res.cloudinary.com",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "images.unsplash.com",
      pathname: "/**",
    },
  ];

  const rawCdnBase = process.env.CASES_CDN_BASE_URL;
  if (!rawCdnBase) {
    return defaults;
  }

  try {
    const url = new URL(rawCdnBase);
    defaults.push({
      protocol: url.protocol.replace(":", "") === "http" ? "http" : "https",
      hostname: url.hostname,
      pathname: `${url.pathname.replace(/\/$/, "")}/**`,
    });
  } catch {
    // ignore invalid env url and keep defaults
  }

  return defaults;
};

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24,
    remotePatterns: buildRemotePatterns(),
  },
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
