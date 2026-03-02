const ENVIRONMENTS = ["DEV", "PREVIEW", "PROD"];
const DEFAULT_MAX_MB = {
  DEV: 5,
  PREVIEW: 3,
  PROD: 8,
};
const DEFAULT_MIME_TYPES =
  "application/pdf,image/png,image/jpeg,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const parsePositiveInteger = (value, fallback) => {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const parseMimeTypes = (value) => {
  const list = String(value ?? DEFAULT_MIME_TYPES)
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  return list.length > 0 ? list : DEFAULT_MIME_TYPES.split(",");
};

const validateMimeTypeList = (list, env) => {
  for (const mimeType of list) {
    if (!mimeType.includes("/")) {
      throw new Error(`[${env}] Invalid mime type configured: ${mimeType}`);
    }
  }
};

const run = async () => {
  for (const env of ENVIRONMENTS) {
    const maxMb = parsePositiveInteger(
      process.env[`LEAD_ATTACHMENT_MAX_SIZE_MB_${env}`],
      DEFAULT_MAX_MB[env],
    );
    if (maxMb > 20) {
      throw new Error(`[${env}] Attachment size above operational cap (20MB): ${maxMb}MB`);
    }

    const mimeTypes = parseMimeTypes(process.env[`LEAD_ATTACHMENT_ALLOWED_MIME_TYPES_${env}`]);
    validateMimeTypeList(mimeTypes, env);

    console.log(
      `[${env}] attachment limits ok -> max=${maxMb}MB, mimeTypes=${mimeTypes.length} configured`,
    );
  }

  console.log("Lead upload limits validation passed.");
};

run().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
