import {
  budgetLeadSubmissionSchema,
  type BudgetAttachmentInput,
  type BudgetLeadInput,
} from "@/schemas/forms/budget";
import { notifyLeadByEmail } from "@/lib/notifications/lead-email";
import { buildLeadWhatsappLink } from "@/lib/whatsapp/lead-whatsapp-link";
import { createBudgetLead } from "@/services/lead.service";

export type BudgetSubmissionResult =
  | {
      ok: true;
      data: {
        id: string;
        createdAt: string;
        status: string;
        internalNotificationSent: boolean;
        clientConfirmationSent: boolean;
        whatsappLink?: string;
      };
    }
  | {
      ok: false;
      error: string;
      issues?: unknown;
    };

export const submitBudgetForm = async (
  input: BudgetLeadInput,
  attachment?: BudgetAttachmentInput,
): Promise<BudgetSubmissionResult> => {
  const parsed = budgetLeadSubmissionSchema.safeParse({
    ...input,
    attachment,
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "Invalid budget payload",
      issues: parsed.error.flatten(),
    };
  }

  const lead = await createBudgetLead(parsed.data, parsed.data.attachment);
  const emailDelivery = await notifyLeadByEmail({
    leadId: lead.id,
    leadName: lead.name,
    leadEmail: lead.email,
    leadPhone: lead.phone,
    projectType: lead.projectType,
    message: lead.message,
    source: lead.source,
    status: "NEW",
    createdAt: lead.createdAt,
  });

  const whatsappLink = buildLeadWhatsappLink({
    leadId: lead.id,
    leadName: lead.name,
    source: lead.source,
  });

  return {
    ok: true,
    data: {
      id: lead.id,
      createdAt: lead.createdAt.toISOString(),
      status: "NEW",
      internalNotificationSent: emailDelivery.internalNotificationSent,
      clientConfirmationSent: emailDelivery.clientConfirmationSent,
      whatsappLink: whatsappLink || undefined,
    },
  };
};
