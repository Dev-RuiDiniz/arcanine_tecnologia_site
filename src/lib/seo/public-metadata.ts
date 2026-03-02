import type { Metadata } from "next";

const siteName = "Arcanine Tecnologia";
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

type PublicMetadataParams = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  noIndex?: boolean;
};

export const buildOgImageUrl = (title: string, description?: string) => {
  const url = new URL("/api/og", appUrl);
  url.searchParams.set("title", title);
  if (description) {
    url.searchParams.set("description", description);
  }
  return url.toString();
};

export const buildPublicMetadata = ({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  noIndex = false,
}: PublicMetadataParams): Metadata => {
  const ogImageUrl = buildOgImageUrl(title, description);

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      type,
      url: path,
      siteName,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${title} | ${siteName}`,
        },
      ],
      publishedTime,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteName}`,
      description,
      images: [ogImageUrl],
    },
  };
};
