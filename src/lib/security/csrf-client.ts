import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from "@/lib/security/csrf-shared";

const getCookieValue = (name: string) => {
  if (typeof document === "undefined") {
    return null;
  }

  const tokenPair = document.cookie
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${name}=`));

  if (!tokenPair) {
    return null;
  }

  return decodeURIComponent(tokenPair.slice(name.length + 1));
};

export const ensureClientCsrfToken = async () => {
  const existing = getCookieValue(CSRF_COOKIE_NAME);
  if (existing) {
    return existing;
  }

  await fetch("/api/csrf", { method: "GET", cache: "no-store" });
  return getCookieValue(CSRF_COOKIE_NAME);
};

export const getCsrfHeader = async (): Promise<Record<string, string>> => {
  const token = await ensureClientCsrfToken();
  if (!token) {
    return {};
  }

  return {
    [CSRF_HEADER_NAME]: token,
  };
};
