import { getGlobalSiteInfo } from "@/lib/site/global-site-info";

export const loadPublicSiteConfig = async () => {
  return getGlobalSiteInfo();
};
