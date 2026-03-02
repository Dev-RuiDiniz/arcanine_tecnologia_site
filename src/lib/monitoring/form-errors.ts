import { registerTelemetryEvent } from "@/lib/telemetry/events";
import { appLogger } from "@/lib/monitoring/logger";
import { captureException } from "@/lib/monitoring/sentry";

type ContactFormErrorContext =
  | "api-contact-route"
  | "api-forms-contact-route"
  | "api-budget-route"
  | "contact-action";

type ContactFormErrorPayload = {
  context: ContactFormErrorContext;
  message: string;
  details?: unknown;
  timestamp: string;
};

const sendWebhookIfConfigured = async (payload: ContactFormErrorPayload) => {
  const webhookUrl = process.env.FORM_ERRORS_WEBHOOK_URL;
  if (!webhookUrl) {
    return;
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // avoid cascading failures during error reporting
  }
};

export const reportContactFormError = async (
  context: ContactFormErrorContext,
  error: unknown,
  details?: unknown,
) => {
  const message = error instanceof Error ? error.message : "Unknown contact form error";
  const payload: ContactFormErrorPayload = {
    context,
    message,
    details,
    timestamp: new Date().toISOString(),
  };

  appLogger.error("contact-form-error", payload as Record<string, unknown>);
  captureException(error, {
    context,
    details,
  });
  await registerTelemetryEvent({
    category: "FORM_ERROR",
    context,
    message,
    details,
  });
  await sendWebhookIfConfigured(payload);
};
