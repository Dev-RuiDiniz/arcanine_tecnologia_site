import { NextResponse } from "next/server";

import type { ApiResult } from "@/lib/api/contracts";
import { validateCsrfRequest } from "@/lib/security/csrf";
import { rateLimit, resolveRateLimitKey } from "@/lib/security/rate-limit";

const DEFAULT_FORM_RATE_LIMIT_MAX = 8;
const DEFAULT_FORM_RATE_LIMIT_WINDOW_SECONDS = 60;

const resolveRateLimitConfig = () => {
  const max = Number(process.env.FORM_RATE_LIMIT_MAX_REQUESTS || DEFAULT_FORM_RATE_LIMIT_MAX);
  const windowSeconds = Number(
    process.env.FORM_RATE_LIMIT_WINDOW_SECONDS || DEFAULT_FORM_RATE_LIMIT_WINDOW_SECONDS,
  );

  return {
    max: Number.isFinite(max) && max > 0 ? max : DEFAULT_FORM_RATE_LIMIT_MAX,
    windowMs:
      Number.isFinite(windowSeconds) && windowSeconds > 0
        ? windowSeconds * 1000
        : DEFAULT_FORM_RATE_LIMIT_WINDOW_SECONDS * 1000,
  };
};

export const enforceFormSecurity = async (request: Request) => {
  const csrfValidation = await validateCsrfRequest(request);
  if (!csrfValidation.ok) {
    return NextResponse.json<ApiResult<never>>(
      {
        ok: false,
        error: csrfValidation.error,
      },
      { status: 403 },
    );
  }

  const rateLimitConfig = resolveRateLimitConfig();
  const key = `${new URL(request.url).pathname}:${resolveRateLimitKey(request)}`;
  const limitResult = rateLimit({
    key,
    max: rateLimitConfig.max,
    windowMs: rateLimitConfig.windowMs,
  });

  if (!limitResult.allowed) {
    const retryAfterSeconds = Math.max(1, Math.ceil((limitResult.resetAt - Date.now()) / 1000));
    return NextResponse.json<ApiResult<never>>(
      {
        ok: false,
        error: "Too many requests. Please retry shortly.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSeconds),
        },
      },
    );
  }

  return null;
};
