import {
  budgetLeadSubmissionSchema,
  type BudgetAttachmentInput,
  type BudgetLeadInput,
} from "@/schemas/forms/budget";
import { createBudgetLead } from "@/services/lead.service";

export type BudgetSubmissionResult =
  | {
      ok: true;
      data: { id: string; createdAt: string };
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
  return {
    ok: true,
    data: {
      id: lead.id,
      createdAt: lead.createdAt.toISOString(),
    },
  };
};
