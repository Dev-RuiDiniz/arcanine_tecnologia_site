import { NextResponse } from "next/server";

import type { ApiResult } from "@/lib/api/contracts";
import { requirePermission } from "@/lib/auth/guards";
import { uploadMediaAsset } from "@/lib/media/storage";
import { createMediaAssetSchema, deleteMediaAssetSchema } from "@/schemas/admin/media";
import { createMediaAsset, deleteMediaAssetById, listMediaAssets } from "@/services/media.service";

const getAllowedMimeTypes = () =>
  (process.env.MEDIA_ALLOWED_MIME_TYPES || "image/jpeg,image/png,image/webp,image/avif")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const getMaxFileSizeBytes = () => {
  const maxMb = Number.parseInt(process.env.MEDIA_MAX_FILE_SIZE_MB || "10", 10);
  return (Number.isFinite(maxMb) && maxMb > 0 ? maxMb : 10) * 1024 * 1024;
};

export async function GET() {
  const permissionCheck = await requirePermission("pages:view");
  if (!permissionCheck.ok) {
    return NextResponse.json<ApiResult<never>>(
      {
        ok: false,
        error: permissionCheck.error,
      },
      { status: permissionCheck.error === "Unauthorized" ? 401 : 403 },
    );
  }

  const media = await listMediaAssets();
  return NextResponse.json<ApiResult<typeof media>>({
    ok: true,
    data: media,
  });
}

export async function POST(request: Request) {
  const permissionCheck = await requirePermission("pages:edit");
  if (!permissionCheck.ok) {
    return NextResponse.json<ApiResult<never>>(
      {
        ok: false,
        error: permissionCheck.error,
      },
      { status: permissionCheck.error === "Unauthorized" ? 401 : 403 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const altText = formData.get("altText");

    if (!(file instanceof File)) {
      return NextResponse.json<ApiResult<never>>(
        {
          ok: false,
          error: "Missing media file",
        },
        { status: 400 },
      );
    }

    const allowedMimeTypes = getAllowedMimeTypes();
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json<ApiResult<never>>(
        {
          ok: false,
          error: "Unsupported media type",
        },
        { status: 400 },
      );
    }

    if (file.size > getMaxFileSizeBytes()) {
      return NextResponse.json<ApiResult<never>>(
        {
          ok: false,
          error: "Media file size exceeds policy limit",
        },
        { status: 400 },
      );
    }

    const uploaded = await uploadMediaAsset(file);
    const parsed = createMediaAssetSchema.safeParse({
      ...uploaded,
      altText: typeof altText === "string" && altText.trim() ? altText.trim() : undefined,
    });

    if (!parsed.success) {
      return NextResponse.json<ApiResult<never>>(
        {
          ok: false,
          error: "Invalid media payload",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const media = await createMediaAsset(parsed.data);
    return NextResponse.json<ApiResult<typeof media>>({
      ok: true,
      data: media,
    });
  } catch (error) {
    return NextResponse.json<ApiResult<never>>(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to upload media",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const permissionCheck = await requirePermission("pages:edit");
  if (!permissionCheck.ok) {
    return NextResponse.json<ApiResult<never>>(
      {
        ok: false,
        error: permissionCheck.error,
      },
      { status: permissionCheck.error === "Unauthorized" ? 401 : 403 },
    );
  }

  try {
    const body = await request.json();
    const parsed = deleteMediaAssetSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<ApiResult<never>>(
        {
          ok: false,
          error: "Invalid media delete payload",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    await deleteMediaAssetById(parsed.data.id);
    return NextResponse.json<ApiResult<{ deleted: true }>>({
      ok: true,
      data: { deleted: true },
    });
  } catch (error) {
    return NextResponse.json<ApiResult<never>>(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to delete media",
      },
      { status: 500 },
    );
  }
}
