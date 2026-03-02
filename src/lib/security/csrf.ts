import { randomUUID } from "node:crypto";

import { cookies } from "next/headers";

import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from "@/lib/security/csrf-shared";

const isSecure = process.env.NODE_ENV === "production";

export const ensureCsrfCookie = async () => {
  const cookieStore = await cookies();
  const existing = cookieStore.get(CSRF_COOKIE_NAME)?.value;
  if (existing) {
    return existing;
  }

  const token = randomUUID();
  cookieStore.set(CSRF_COOKIE_NAME, token, {
    httpOnly: false,
    sameSite: "strict",
    secure: isSecure,
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return token;
};

const getOriginFromHeaders = (request: Request) => {
  const origin = request.headers.get("origin");
  if (origin) {
    return origin;
  }

  const referer = request.headers.get("referer");
  if (!referer) {
    return null;
  }

  try {
    return new URL(referer).origin;
  } catch {
    return null;
  }
};

export const validateCsrfRequest = async (request: Request) => {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(CSRF_COOKIE_NAME)?.value;
  const headerToken = request.headers.get(CSRF_HEADER_NAME);

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return {
      ok: false as const,
      error: "Invalid CSRF token",
    };
  }

  const requestOrigin = getOriginFromHeaders(request);
  if (!requestOrigin) {
    return {
      ok: false as const,
      error: "Missing request origin",
    };
  }

  const currentOrigin = new URL(request.url).origin;
  if (requestOrigin !== currentOrigin) {
    return {
      ok: false as const,
      error: "Invalid request origin",
    };
  }

  return { ok: true as const };
};
