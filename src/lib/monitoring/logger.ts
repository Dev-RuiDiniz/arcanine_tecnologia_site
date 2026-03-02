export type LogLevel = "info" | "warn" | "error";

type LogMeta = Record<string, unknown>;

const baseLog = (level: LogLevel, message: string, meta?: LogMeta) => {
  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(meta ? { meta } : {}),
  };

  if (level === "error") {
    console.error(JSON.stringify(payload));
    return;
  }

  if (level === "warn") {
    console.warn(JSON.stringify(payload));
    return;
  }

  console.log(JSON.stringify(payload));
};

export const appLogger = {
  info: (message: string, meta?: LogMeta) => baseLog("info", message, meta),
  warn: (message: string, meta?: LogMeta) => baseLog("warn", message, meta),
  error: (message: string, meta?: LogMeta) => baseLog("error", message, meta),
};
