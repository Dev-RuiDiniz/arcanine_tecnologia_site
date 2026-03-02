import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import type { ApiResult } from "@/lib/api/contracts";
import { authOptions } from "@/lib/auth/options";
import { createPageSchema } from "@/schemas/admin/page";
import { createPage, listPages } from "@/services/page.service";

const toPageResponse = (page: {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  published: boolean;
  content: unknown;
  createdAt: Date;
  updatedAt: Date;
}) => ({
  ...page,
  createdAt: page.createdAt.toISOString(),
  updatedAt: page.updatedAt.toISOString(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json<ApiResult<never>>(
        {
          ok: false,
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const pages = await listPages();
    return NextResponse.json<ApiResult<ReturnType<typeof toPageResponse>[]>>({
      ok: true,
      data: pages.map(toPageResponse),
    });
  } catch {
    return NextResponse.json<ApiResult<never>>(
      {
        ok: false,
        error: "Unexpected error while loading pages",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json<ApiResult<never>>(
        {
          ok: false,
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const body = await request.json();
    const parsed = createPageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json<ApiResult<never>>(
        {
          ok: false,
          error: "Invalid page payload",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const page = await createPage(parsed.data);
    return NextResponse.json<ApiResult<ReturnType<typeof toPageResponse>>>({
      ok: true,
      data: toPageResponse(page),
    });
  } catch {
    return NextResponse.json<ApiResult<never>>(
      {
        ok: false,
        error: "Unexpected error while creating page",
      },
      { status: 500 },
    );
  }
}
