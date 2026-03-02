import sanitizeHtml from "sanitize-html";

const sanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: [],
  allowedAttributes: {},
};

const normalizeWhitespace = (value: string) => {
  return value
    .replace(/\r\n/g, "\n")
    .replace(/[^\S\n]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

export const sanitizePlainText = (value: string) => {
  return normalizeWhitespace(sanitizeHtml(value, sanitizeOptions));
};

export const sanitizeOptionalPlainText = (value?: string | null) => {
  if (!value) {
    return undefined;
  }
  const sanitized = sanitizePlainText(value);
  return sanitized || undefined;
};
