import { appLogger } from "@/lib/monitoring/logger";
import { registerTelemetryEvent } from "@/lib/telemetry/events";

type AdminAuditInput = {
  action: string;
  resource: string;
  actorEmail?: string;
  details?: unknown;
};

export const registerAdminAuditEvent = async (input: AdminAuditInput) => {
  appLogger.info("admin.audit.event", {
    action: input.action,
    resource: input.resource,
    actorEmail: input.actorEmail,
  });
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
