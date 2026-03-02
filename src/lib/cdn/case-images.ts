const defaultCasesCdnBase = "https://res.cloudinary.com/demo/image/upload";

const normalizedBase = () => {
  const raw = process.env.CASES_CDN_BASE_URL || defaultCasesCdnBase;
  return raw.replace(/\/+$/, "");
};

export const buildCaseImageUrl = (imagePath: string) => {
  const safePath = imagePath.replace(/^\/+/, "");
  return `${normalizedBase()}/${safePath}`;
};

export const getCasesCdnBase = () => normalizedBase();
