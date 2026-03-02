type RuntimeEnvironment = "development" | "preview" | "production";

export type LeadAttachmentLimits = {
  maxSizeMb: number;
  maxSizeBytes: number;
  allowedMimeTypes: string[];
};

const DEFAULT_MAX_SIZE_MB = {
  development: 5,
  preview: 3,
  production: 8,
} as const;

const DEFAULT_ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const resolveEnvironment = (): RuntimeEnvironment => {
  const env = process.env.VERCEL_ENV;
  if (env === "preview" || env === "production") {
    return env;
  }
  return "development";
};

const parsePositiveInteger = (value: string | undefined, fallback: number) => {
  const parsed = Number.parseInt(value || "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const parseMimeTypes = (value: string | undefined) => {
  if (!value) {
    return DEFAULT_ALLOWED_MIME_TYPES;
  }

  const types = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return types.length > 0 ? types : DEFAULT_ALLOWED_MIME_TYPES;
};

export const resolveLeadAttachmentLimits = (): LeadAttachmentLimits => {
  const environment = resolveEnvironment();

  const maxSizeMb = parsePositiveInteger(
    process.env[`LEAD_ATTACHMENT_MAX_SIZE_MB_${environment.toUpperCase()}`] ||
      process.env.LEAD_ATTACHMENT_MAX_SIZE_MB,
    DEFAULT_MAX_SIZE_MB[environment],
  );

  const allowedMimeTypes = parseMimeTypes(
    process.env[`LEAD_ATTACHMENT_ALLOWED_MIME_TYPES_${environment.toUpperCase()}`] ||
      process.env.LEAD_ATTACHMENT_ALLOWED_MIME_TYPES,
  );

  return {
    maxSizeMb,
    maxSizeBytes: maxSizeMb * 1024 * 1024,
    allowedMimeTypes,
  };
};
