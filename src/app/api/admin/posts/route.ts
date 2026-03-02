import { NextResponse } from "next/server";

import type { ApiResult } from "@/lib/api/contracts";
import { requirePermission } from "@/lib/auth/guards";
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
    const body = await request.json();
    const parsed = postAdminUpsertSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<ApiResult<never>>(
        { ok: false, error: "Invalid post payload", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const saved = await saveAdminPost(parsed.data);
    return NextResponse.json<ApiResult<typeof saved>>({
      ok: true,
      data: saved,
    });
  } catch (error) {
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
    const body = await request.json();
    const parsed = postAdminDeleteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<ApiResult<never>>(
        { ok: false, error: "Invalid post delete payload", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    await deleteAdminPostById(parsed.data.id);
    return NextResponse.json<ApiResult<{ deleted: true }>>({
      ok: true,
      data: { deleted: true },
    });
  } catch (error) {
    return NextResponse.json<ApiResult<never>>(
      { ok: false, error: error instanceof Error ? error.message : "Unable to delete post" },
      { status: 500 },
    );
  }
}
