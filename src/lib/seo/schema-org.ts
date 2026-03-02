const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

type BreadcrumbItem = {
  name: string;
  path: string;
};

export const buildOrganizationSchema = (input: {
  companyName: string;
  email: string;
  phone: string;
  websiteUrl?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: input.companyName,
  url: input.websiteUrl || appUrl,
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      telephone: input.phone,
      email: input.email,
    },
  ],
});

export const buildArticleSchema = (input: {
  title: string;
  description: string;
  slug: string;
  publishedAt?: string;
  updatedAt: string;
  imageUrl: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: input.title,
  description: input.description,
  datePublished: input.publishedAt || input.updatedAt,
  dateModified: input.updatedAt,
  mainEntityOfPage: `${appUrl}/insights/${input.slug}`,
  image: [input.imageUrl],
  author: {
    "@type": "Organization",
    name: "Arcanine Tecnologia",
  },
  publisher: {
    "@type": "Organization",
    name: "Arcanine Tecnologia",
  },
});

export const buildBreadcrumbSchema = (items: BreadcrumbItem[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `${appUrl}${item.path}`,
  })),
});
