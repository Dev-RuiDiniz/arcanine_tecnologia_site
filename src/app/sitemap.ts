import type { MetadataRoute } from "next";

import { listPublicCases } from "@/services/case-content.service";
import { listPublicPosts } from "@/services/post.service";
import { listPublicServices } from "@/services/service-content.service";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, cases, postsResult] = await Promise.all([
    listPublicServices(),
    listPublicCases(),
    listPublicPosts(),
  ]);

  const baseRoutes: MetadataRoute.Sitemap = [
    "",
    "/sobre",
    "/servicos",
    "/cases",
    "/insights",
    "/contato",
    "/politica-de-privacidade",
    "/termos-de-uso",
  ].map((path) => ({
    url: `${appUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${appUrl}/servicos/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const caseRoutes: MetadataRoute.Sitemap = cases.map((caseItem) => ({
    url: `${appUrl}/cases/${caseItem.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const postRoutes: MetadataRoute.Sitemap = postsResult.posts.map((post) => ({
    url: `${appUrl}/insights/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...baseRoutes, ...serviceRoutes, ...caseRoutes, ...postRoutes];
}
