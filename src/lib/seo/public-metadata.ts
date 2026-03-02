import type { Metadata } from "next";

const siteName = "Arcanine Tecnologia";

type PublicMetadataParams = {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
};

export const buildPublicMetadata = ({
  title,
  description,
  path,
  noIndex = false,
}: PublicMetadataParams): Metadata => {
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
      type: "website",
      url: path,
      siteName,
    },
  };
};
