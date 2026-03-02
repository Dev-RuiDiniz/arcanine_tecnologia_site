import type { ApiResult } from "@/lib/api/contracts";
import { getCsrfHeader } from "@/lib/security/csrf-client";

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions = {
  method?: RequestMethod;
  body?: unknown;
  headers?: Record<string, string>;
  cache?: RequestCache;
};

export const apiRequest = async <T>(
  url: string,
  options: RequestOptions = {},
): Promise<ApiResult<T>> => {
  const csrfHeader =
    options.method && options.method !== "GET"
      ? await getCsrfHeader()
      : ({} as Record<string, string>);

  const response = await fetch(url, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...csrfHeader,
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: options.cache ?? "no-store",
  });

  const payload = (await response.json()) as ApiResult<T>;
  return payload;
};
