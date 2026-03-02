import { NextResponse } from "next/server";

import type { ApiResult } from "@/lib/api/contracts";
import { requirePermission } from "@/lib/auth/guards";
import { appLogger } from "@/lib/monitoring/logger";
import { captureException } from "@/lib/monitoring/sentry";
import { postAdminDeleteSchema, postAdminUpsertSchema } from "@/schemas/admin/post-admin";
import { deleteAdminPostById, listAdminPosts, saveAdminPost } from "@/services/post.service";

export async function GET() {
  const permissionCheck = await requirePermission("pages:view");
  if (!permissionCheck.ok) {
    return NextResponse.json<ApiResult<never>>(
      { ok: false, error: permissionCheck.error },
      { status: permissionCheck.error === "Unauthorized" ? 401 : 403 },
    );
  }

  const posts = await listAdminPosts();
  return NextResponse.json<ApiResult<typeof posts>>({
    ok: true,
    data: posts,
  });
}

export async function POST(request: Request) {
  const permissionCheck = await requirePermission("pages:edit");
  if (!permissionCheck.ok) {
    return NextResponse.json<ApiResult<never>>(
      { ok: false, error: permissionCheck.error },
      { status: permissionCheck.error === "Unauthorized" ? 401 : 403 },
    );
  }

  try {
    appLogger.info("api.admin.posts.save.request");
    const body = await request.json();
    const parsed = postAdminUpsertSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<ApiResult<never>>(
        { ok: false, error: "Invalid post payload", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const saved = await saveAdminPost(parsed.data);
    appLogger.info("api.admin.posts.save.success", {
      postId: saved.id,
      slug: saved.slug,
      status: saved.status,
    });
    return NextResponse.json<ApiResult<typeof saved>>({
      ok: true,
      data: saved,
    });
  } catch (error) {
    captureException(error, { context: "api-admin-posts-save" });
    appLogger.error("api.admin.posts.save.failure", {
      error: error instanceof Error ? error.message : "Unknown post save error",
    });
    return NextResponse.json<ApiResult<never>>(
      { ok: false, error: error instanceof Error ? error.message : "Unable to save post" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const permissionCheck = await requirePermission("pages:edit");
  if (!permissionCheck.ok) {
    return NextResponse.json<ApiResult<never>>(
      { ok: false, error: permissionCheck.error },
      { status: permissionCheck.error === "Unauthorized" ? 401 : 403 },
    );
  }

  try {
    appLogger.info("api.admin.posts.delete.request");
    const body = await request.json();
    const parsed = postAdminDeleteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<ApiResult<never>>(
        { ok: false, error: "Invalid post delete payload", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    await deleteAdminPostById(parsed.data.id);
    appLogger.info("api.admin.posts.delete.success", {
      postId: parsed.data.id,
    });
    return NextResponse.json<ApiResult<{ deleted: true }>>({
      ok: true,
      data: { deleted: true },
    });
  } catch (error) {
    captureException(error, { context: "api-admin-posts-delete" });
    appLogger.error("api.admin.posts.delete.failure", {
      error: error instanceof Error ? error.message : "Unknown post delete error",
    });
    return NextResponse.json<ApiResult<never>>(
      { ok: false, error: error instanceof Error ? error.message : "Unable to delete post" },
      { status: 500 },
    );
  }
}
