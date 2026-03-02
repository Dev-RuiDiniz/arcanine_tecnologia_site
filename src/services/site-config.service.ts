import { getGlobalSiteInfo } from "@/lib/site/global-site-info";
import { loadGeneralSettings } from "@/services/settings-admin.service";

export const loadPublicSiteConfig = async () => {
  const envConfig = getGlobalSiteInfo();
  try {
    const general = await loadGeneralSettings();
    return {
      companyName: general.companyName,
      email: general.email,
      phone: general.phone,
      whatsapp: general.whatsapp,
      mapEmbedUrl: general.mapEmbedUrl,
      address: {
        street: general.addressStreet,
        city: general.addressCity,
        state: general.addressState,
        zipCode: general.addressZip,
        country: general.addressCountry,
      },
      socials: JSON.parse(general.socialLinksJson) as { label: string; href: string }[],
    };
  } catch {
    return envConfig;
  }
};
