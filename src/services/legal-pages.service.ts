import { getLegalPage, listLegalPages, type LegalPageSlug } from "@/content/legal-pages";

export const loadLegalPageBySlug = async (slug: LegalPageSlug) => {
  return getLegalPage(slug);
};

export const loadLegalPages = async () => {
  return listLegalPages();
};
