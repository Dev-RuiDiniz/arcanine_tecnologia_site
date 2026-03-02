import { registerTelemetryEvent } from "@/lib/telemetry/events";
import { appLogger } from "@/lib/monitoring/logger";
import { captureException } from "@/lib/monitoring/sentry";

type EmailDeliveryContext = "lead-internal-notification" | "lead-client-confirmation";

type EmailDeliveryErrorPayload = {
  context: EmailDeliveryContext;
  message: string;
  details?: unknown;
  timestamp: string;
};

const sendWebhookIfConfigured = async (payload: EmailDeliveryErrorPayload) => {
  const webhookUrl = process.env.EMAIL_DELIVERY_ERRORS_WEBHOOK_URL;
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

export const reportEmailDeliveryError = async (
  context: EmailDeliveryContext,
  error: unknown,
  details?: unknown,
) => {
  const message = error instanceof Error ? error.message : "Unknown email delivery error";
  const payload: EmailDeliveryErrorPayload = {
    context,
    message,
    details,
    timestamp: new Date().toISOString(),
  };

  appLogger.error("email-delivery-error", payload as Record<string, unknown>);
  captureException(error, {
    context,
    details,
  });
  await registerTelemetryEvent({
    category: "EMAIL_DELIVERY_ERROR",
    context,
    message,
    details,
  });
  await sendWebhookIfConfigured(payload);
};
