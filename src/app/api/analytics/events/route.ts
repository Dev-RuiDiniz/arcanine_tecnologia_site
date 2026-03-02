import { NextResponse } from "next/server";
import { z } from "zod";

import type { ApiResult } from "@/lib/api/contracts";
import { appLogger } from "@/lib/monitoring/logger";

const payloadSchema = z.object({
  name: z.enum(["lead_submit_contact", "lead_submit_budget", "whatsapp_click", "budget_cta_click"]),
  category: z.enum(["lead", "engagement"]),
  label: z.string().max(160).optional(),
  value: z.number().optional(),
  metadata: z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]))
    .optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = payloadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<ApiResult<never>>(
        {
          ok: false,
          error: "Invalid analytics event payload",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    appLogger.info("analytics.event.received", {
      name: parsed.data.name,
      category: parsed.data.category,
      label: parsed.data.label,
      metadata: parsed.data.metadata,
    });

    return NextResponse.json<ApiResult<{ accepted: true }>>({
      ok: true,
      data: { accepted: true },
    });
  } catch (error) {
    appLogger.error("analytics.event.failure", {
      error: error instanceof Error ? error.message : "Unknown analytics event failure",
    });

    return NextResponse.json<ApiResult<never>>(
      {
        ok: false,
        error: "Unable to register analytics event",
      },
      { status: 500 },
    );
  }
}
