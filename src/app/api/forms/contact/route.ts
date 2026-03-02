import { NextResponse } from "next/server";

import type { ApiResult } from "@/lib/api/contracts";
import { reportContactFormError } from "@/lib/monitoring/form-errors";
import { submitContactForm } from "@/services/contact-form.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await submitContactForm(body);
    if (!result.ok) {
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
    await reportContactFormError("api-forms-contact-route", error);
    return NextResponse.json<ApiResult<never>>(
      {
        ok: false,
        error: "Unexpected error while creating lead",
      },
      { status: 500 },
    );
  }
}
