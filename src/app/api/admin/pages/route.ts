import { NextResponse } from "next/server";

import type { ApiResult } from "@/lib/api/contracts";
import { requirePermission } from "@/lib/auth/guards";
import { cmsPagePublishSchema, cmsPageUpsertSchema } from "@/schemas/admin/cms-page";
import { listCmsPages, publishCmsPage, saveCmsPageDraft } from "@/services/page.service";

export async function GET() {
  try {
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

    const pages = await listCmsPages();
    return NextResponse.json<ApiResult<typeof pages>>({
      ok: true,
      data: pages,
    });
  } catch {
    return NextResponse.json<ApiResult<never>>(
      {
        ok: false,
        error: "Unexpected error while loading cms pages",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
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

    const body = await request.json();
    const parsed = cmsPageUpsertSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<ApiResult<never>>(
        {
          ok: false,
          error: "Invalid cms page payload",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const page = await saveCmsPageDraft(parsed.data);
    return NextResponse.json<ApiResult<typeof page>>({
      ok: true,
      data: page,
    });
  } catch {
    return NextResponse.json<ApiResult<never>>(
      {
        ok: false,
        error: "Unexpected error while saving cms page draft",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
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

    const body = await request.json();
    const parsed = cmsPagePublishSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<ApiResult<never>>(
        {
          ok: false,
          error: "Invalid cms page publish payload",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const page = await publishCmsPage(parsed.data.slug);
    return NextResponse.json<ApiResult<typeof page>>({
      ok: true,
      data: page,
    });
  } catch {
    return NextResponse.json<ApiResult<never>>(
      {
        ok: false,
        error: "Unexpected error while publishing cms page",
      },
      { status: 500 },
    );
  }
}
