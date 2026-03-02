type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitBucket>();

const now = () => Date.now();

const cleanupExpired = () => {
  const currentTime = now();
  for (const [key, bucket] of store.entries()) {
    if (bucket.resetAt <= currentTime) {
      store.delete(key);
    }
  }
};

export const rateLimit = (input: { key: string; max: number; windowMs: number }) => {
  cleanupExpired();

  const currentTime = now();
  const existing = store.get(input.key);
  if (!existing || existing.resetAt <= currentTime) {
    store.set(input.key, {
      count: 1,
      resetAt: currentTime + input.windowMs,
    });
    return {
      allowed: true,
      remaining: input.max - 1,
      resetAt: currentTime + input.windowMs,
    };
  }

  existing.count += 1;
  store.set(input.key, existing);

  return {
    allowed: existing.count <= input.max,
    remaining: Math.max(0, input.max - existing.count),
    resetAt: existing.resetAt,
  };
};

export const resolveRateLimitKey = (request: Request) => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) {
      return first;
    }
  }

  return request.headers.get("x-real-ip") || "unknown";
};
