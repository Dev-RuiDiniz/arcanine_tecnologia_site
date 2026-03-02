import { NextResponse } from "next/server";

import type { ApiResult } from "@/lib/api/contracts";
import { contactLeadSchema } from "@/schemas/forms/contact";
import { createLead } from "@/services/lead.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactLeadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json<ApiResult<never>>(
        {
          ok: false,
          error: "Invalid contact payload",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const lead = await createLead(parsed.data);
    return NextResponse.json<ApiResult<{ id: string; createdAt: string }>>({
      ok: true,
      data: {
        id: lead.id,
        createdAt: lead.createdAt.toISOString(),
      },
    });
  } catch {
    return NextResponse.json<ApiResult<never>>(
      {
        ok: false,
        error: "Unexpected error while creating lead",
      },
      { status: 500 },
    );
  }
}
