import { notifyLeadByEmail } from "@/lib/notifications/lead-email";
import { buildLeadWhatsappLink } from "@/lib/whatsapp/lead-whatsapp-link";
import { contactLeadSchema, type ContactLeadInput } from "@/schemas/forms/contact";

import { createLead } from "@/services/lead.service";

export type ContactSubmissionResult =
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

export const submitContactForm = async (
  input: ContactLeadInput,
): Promise<ContactSubmissionResult> => {
  const parsed = contactLeadSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Invalid contact payload",
      issues: parsed.error.flatten(),
    };
  }

  const lead = await createLead(parsed.data);
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
