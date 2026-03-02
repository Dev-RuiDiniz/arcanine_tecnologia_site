import { registerTelemetryEvent } from "@/lib/telemetry/events";

type AdminAuditInput = {
  action: string;
  resource: string;
  actorEmail?: string;
  details?: unknown;
};

export const registerAdminAuditEvent = async (input: AdminAuditInput) => {
  await registerTelemetryEvent({
    category: "ADMIN_AUDIT",
    context: `admin:${input.resource}`,
    message: input.action,
    details: {
      actorEmail: input.actorEmail,
      ...((input.details as Record<string, unknown> | undefined) || {}),
    },
  });
};
