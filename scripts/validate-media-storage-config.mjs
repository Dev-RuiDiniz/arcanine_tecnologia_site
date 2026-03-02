const run = async () => {
  const provider = process.env.MEDIA_STORAGE_PROVIDER || "cloudinary";

  if (provider !== "cloudinary") {
    throw new Error(`Unsupported MEDIA_STORAGE_PROVIDER: ${provider}`);
  }

  const requiredVars = ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_UPLOAD_PRESET"];
  const missing = requiredVars.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing media storage vars: ${missing.join(", ")}`);
  }

  const allowedMimeTypes =
    process.env.MEDIA_ALLOWED_MIME_TYPES || "image/jpeg,image/png,image/webp,image/avif";
  if (!allowedMimeTypes.includes("image/")) {
    throw new Error("MEDIA_ALLOWED_MIME_TYPES must include image mime types.");
  }

  const maxFileMb = Number.parseInt(process.env.MEDIA_MAX_FILE_SIZE_MB || "10", 10);
  if (!Number.isFinite(maxFileMb) || maxFileMb <= 0 || maxFileMb > 25) {
    throw new Error("MEDIA_MAX_FILE_SIZE_MB must be between 1 and 25.");
  }

  console.log(`Media storage config validation passed. provider=${provider} max=${maxFileMb}MB`);
};

run().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
