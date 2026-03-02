type UploadMediaResult = {
  provider: string;
  storageKey: string;
  url: string;
  optimizedUrl: string;
  bytes: number;
  mimeType: string;
  width?: number;
  height?: number;
};

const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1";

const buildCloudinaryOptimizedUrl = (url: string) => {
  const marker = "/upload/";
  if (!url.includes(marker)) {
    return url;
  }
  return url.replace(marker, "/upload/f_auto,q_auto/");
};

const uploadToCloudinary = async (file: File): Promise<UploadMediaResult> => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary credentials not configured.");
  }

  const formData = new FormData();
  formData.set("file", file);
  formData.set("upload_preset", uploadPreset);
  formData.set("folder", process.env.MEDIA_UPLOAD_FOLDER || "arcanine/cases");
  formData.set("resource_type", "image");

  const response = await fetch(`${CLOUDINARY_UPLOAD_URL}/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });
  const payload = (await response.json()) as {
    secure_url?: string;
    public_id?: string;
    bytes?: number;
    width?: number;
    height?: number;
    format?: string;
    error?: { message?: string };
  };

  if (!response.ok || !payload.secure_url || !payload.public_id) {
    throw new Error(payload.error?.message || "Unable to upload media to Cloudinary.");
  }

  return {
    provider: "cloudinary",
    storageKey: payload.public_id,
    url: payload.secure_url,
    optimizedUrl: buildCloudinaryOptimizedUrl(payload.secure_url),
    bytes: payload.bytes || file.size,
    mimeType: file.type || `image/${payload.format || "jpeg"}`,
    width: payload.width,
    height: payload.height,
  };
};

export const uploadMediaAsset = async (file: File): Promise<UploadMediaResult> => {
  const provider = process.env.MEDIA_STORAGE_PROVIDER || "cloudinary";

  if (provider === "cloudinary") {
    return uploadToCloudinary(file);
  }

  throw new Error(`Unsupported media storage provider: ${provider}`);
};
