import { apiRequest } from "@/lib/api/client";
import type { CreatePageInput } from "@/schemas/admin/page";

type PageDto = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  published: boolean;
  content: unknown;
  createdAt: string;
  updatedAt: string;
};

export const fetchAdminPages = async () => {
  return apiRequest<PageDto[]>("/api/admin/pages");
};

export const createAdminPage = async (input: CreatePageInput) => {
  return apiRequest<PageDto>("/api/admin/pages", {
    method: "POST",
    body: input,
  });
};
