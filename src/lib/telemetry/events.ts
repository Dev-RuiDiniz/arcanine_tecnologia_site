import { mkdir, readFile, appendFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export type TelemetryCategory = "FORM_ERROR" | "EMAIL_DELIVERY_ERROR" | "ADMIN_AUDIT";

export type TelemetryEvent = {
  id: string;
  category: TelemetryCategory;
  context: string;
  message: string;
  timestamp: string;
  details?: unknown;
};

type RegisterTelemetryEventInput = {
  category: TelemetryCategory;
  context: string;
  message: string;
  details?: unknown;
};

type ListTelemetryEventsInput = {
  limit?: number;
  since?: Date;
};

const isTelemetryEnabled = () => process.env.TELEMETRY_ENABLED !== "false";

const resolveLogPath = () => {
  const configuredPath = process.env.TELEMETRY_LOG_PATH || ".telemetry/events.jsonl";
  return path.isAbsolute(configuredPath)
    ? configuredPath
    : path.resolve(process.cwd(), configuredPath);
};

const parseEvent = (line: string): TelemetryEvent | null => {
  try {
    const parsed = JSON.parse(line) as TelemetryEvent;
    if (!parsed.id || !parsed.category || !parsed.context || !parsed.message || !parsed.timestamp) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export const registerTelemetryEvent = async (input: RegisterTelemetryEventInput) => {
  if (!isTelemetryEnabled()) {
    return;
  }

  const event: TelemetryEvent = {
    id: randomUUID(),
    category: input.category,
    context: input.context,
    message: input.message,
    details: input.details,
    timestamp: new Date().toISOString(),
  };

  const logPath = resolveLogPath();
  await mkdir(path.dirname(logPath), { recursive: true });
  await appendFile(logPath, `${JSON.stringify(event)}\n`, "utf8");
};

export const listTelemetryEvents = async ({
  limit = 20,
  since,
}: ListTelemetryEventsInput = {}): Promise<TelemetryEvent[]> => {
  if (!isTelemetryEnabled()) {
    return [];
  }

  const logPath = resolveLogPath();
  try {
    const fileContents = await readFile(logPath, "utf8");
    const events = fileContents
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => parseEvent(line))
      .filter((event): event is TelemetryEvent => event !== null)
      .filter((event) => (since ? new Date(event.timestamp) >= since : true))
      .sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1));

    return events.slice(0, Math.max(1, limit));
  } catch {
    return [];
  }
};
