import { NextResponse } from "next/server";

import type { ApiResult } from "@/lib/api/contracts";
import { reportContactFormError } from "@/lib/monitoring/form-errors";
import { appLogger } from "@/lib/monitoring/logger";
import { enforceFormSecurity } from "@/lib/security/form-guards";
import { submitContactForm } from "@/services/contact-form.service";

export async function POST(request: Request) {
  appLogger.info("api.contact.submit.request");
  const blocked = await enforceFormSecurity(request);
  if (blocked) {
    appLogger.warn("api.contact.submit.blocked");
    return blocked;
  }

  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json<ApiResult<never>>(
        {
          ok: false,
          error: "Invalid content type",
        },
        { status: 400 },
      );
    }

    const body = await request.json();
    const result = await submitContactForm(body);

    if (!result.ok) {
      appLogger.warn("api.contact.submit.validation-failed", {
        error: result.error,
      });
      return NextResponse.json<ApiResult<never>>(
        {
          ok: false,
          error: result.error,
          issues: result.issues,
        },
        { status: 400 },
      );
    }

    return NextResponse.json<
      ApiResult<{
        id: string;
        createdAt: string;
        status: string;
        internalNotificationSent: boolean;
        clientConfirmationSent: boolean;
        whatsappLink?: string;
      }>
    >({
      ok: true,
      data: result.data,
    });
  } catch (error) {
    appLogger.error("api.contact.submit.failure", {
      error: error instanceof Error ? error.message : "Unknown contact route failure",
    });
    await reportContactFormError("api-contact-route", error);
    return NextResponse.json<ApiResult<never>>(
      {
        ok: false,
        error: "Unexpected error while creating lead",
      },
      { status: 500 },
    );
  }
}
