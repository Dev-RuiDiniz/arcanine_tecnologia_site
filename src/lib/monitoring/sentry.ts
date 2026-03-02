import * as Sentry from "@sentry/node";

let initialized = false;

const resolveDsn = () => process.env.SENTRY_DSN || "";

const ensureSentry = () => {
  if (initialized) {
    return Boolean(resolveDsn());
  }

  const dsn = resolveDsn();
  if (!dsn) {
    initialized = true;
    return false;
  }

  Sentry.init({
    dsn,
    environment:
      process.env.SENTRY_ENVIRONMENT || process.env.VERCEL_ENV || process.env.NODE_ENV || "unknown",
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || 0),
  });

  initialized = true;
  return true;
};

export const captureException = (error: unknown, context?: Record<string, unknown>) => {
  if (!ensureSentry()) {
    return;
  }

  Sentry.captureException(error, {
    extra: context,
  });
};

export const captureMessage = (
  message: string,
  level: "info" | "warning" | "error" = "info",
  context?: Record<string, unknown>,
) => {
  if (!ensureSentry()) {
    return;
  }

  Sentry.captureMessage(message, {
    level,
    extra: context,
  });
};
