import { z } from "zod";

const socialLinkSchema = z.object({
  label: z.string(),
  href: z.string().url(),
});

const addressSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  country: z.string(),
});

const globalSiteInfoSchema = z.object({
  companyName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  whatsapp: z.string(),
  address: addressSchema,
  socials: z.array(socialLinkSchema),
});

export type GlobalSiteInfo = z.infer<typeof globalSiteInfoSchema>;

const fallbackGlobalInfo: GlobalSiteInfo = {
  companyName: "Arcanine Tecnologia",
  email: "contato@arcanine.com.br",
  phone: "+55 11 3000-4000",
  whatsapp: "+55 11 99999-9999",
  address: {
    street: "Avenida Paulista, 1000",
    city: "Sao Paulo",
    state: "SP",
    zipCode: "01310-100",
    country: "Brasil",
  },
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com" },
    { label: "Instagram", href: "https://www.instagram.com" },
    { label: "GitHub", href: "https://github.com" },
  ],
};

const parseSocialsFromEnv = () => {
  const rawSocials = process.env.SITE_SOCIAL_LINKS_JSON;
  if (!rawSocials) {
    return fallbackGlobalInfo.socials;
  }

  try {
    const parsed = JSON.parse(rawSocials);
    const validated = z.array(socialLinkSchema).parse(parsed);
    return validated;
  } catch {
    return fallbackGlobalInfo.socials;
  }
};

export const getGlobalSiteInfo = (): GlobalSiteInfo => {
  const candidate: GlobalSiteInfo = {
    companyName: process.env.SITE_COMPANY_NAME || fallbackGlobalInfo.companyName,
    email: process.env.SITE_CONTACT_EMAIL || fallbackGlobalInfo.email,
    phone: process.env.SITE_CONTACT_PHONE || fallbackGlobalInfo.phone,
    whatsapp: process.env.SITE_CONTACT_WHATSAPP || fallbackGlobalInfo.whatsapp,
    address: {
      street: process.env.SITE_ADDRESS_STREET || fallbackGlobalInfo.address.street,
      city: process.env.SITE_ADDRESS_CITY || fallbackGlobalInfo.address.city,
      state: process.env.SITE_ADDRESS_STATE || fallbackGlobalInfo.address.state,
      zipCode: process.env.SITE_ADDRESS_ZIP || fallbackGlobalInfo.address.zipCode,
      country: process.env.SITE_ADDRESS_COUNTRY || fallbackGlobalInfo.address.country,
    },
    socials: parseSocialsFromEnv(),
  };

  return globalSiteInfoSchema.parse(candidate);
};
