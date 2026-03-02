import { NextResponse } from "next/server";

import type { ApiResult } from "@/lib/api/contracts";
import { resolveLeadAttachmentLimits } from "@/lib/env/upload-limits";
import { reportContactFormError } from "@/lib/monitoring/form-errors";
import { enforceFormSecurity } from "@/lib/security/form-guards";
import { budgetLeadSchema, type BudgetAttachmentInput } from "@/schemas/forms/budget";
import { submitBudgetForm } from "@/services/budget-form.service";

const getFieldValue = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
};

export async function POST(request: Request) {
  const blocked = await enforceFormSecurity(request);
  if (blocked) {
    return blocked;
  }

  try {
    const formData = await request.formData();

    const parsed = budgetLeadSchema.safeParse({
      contactName: getFieldValue(formData, "contactName"),
      companyName: getFieldValue(formData, "companyName"),
      email: getFieldValue(formData, "email"),
      phone: getFieldValue(formData, "phone"),
      service: getFieldValue(formData, "service"),
      budgetRange: getFieldValue(formData, "budgetRange"),
      timeline: getFieldValue(formData, "timeline"),
      projectBrief: getFieldValue(formData, "projectBrief"),
    });

    if (!parsed.success) {
      return NextResponse.json<ApiResult<never>>(
        {
          ok: false,
          error: "Invalid budget payload",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const limits = resolveLeadAttachmentLimits();
    const attachmentFile = formData.get("attachment");
    let attachmentMetadata: BudgetAttachmentInput | undefined;

    if (attachmentFile instanceof File && attachmentFile.size > 0) {
      if (attachmentFile.size > limits.maxSizeBytes) {
        return NextResponse.json<ApiResult<never>>(
          {
            ok: false,
            error: `Attachment exceeds limit of ${limits.maxSizeMb}MB`,
          },
          { status: 400 },
        );
      }

      if (!limits.allowedMimeTypes.includes(attachmentFile.type)) {
        return NextResponse.json<ApiResult<never>>(
          {
            ok: false,
            error: "Attachment type not allowed",
          },
          { status: 400 },
        );
      }

      attachmentMetadata = {
        filename: attachmentFile.name,
        contentType: attachmentFile.type,
        sizeBytes: attachmentFile.size,
      };
    }

    const result = await submitBudgetForm(parsed.data, attachmentMetadata);

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
    await reportContactFormError("api-budget-route", error);
    return NextResponse.json<ApiResult<never>>(
      {
        ok: false,
        error: "Unexpected error while creating budget lead",
      },
      { status: 500 },
    );
  }
}
