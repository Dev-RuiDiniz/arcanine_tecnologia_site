import test from "node:test";
import assert from "node:assert/strict";

import {
  __resetRateLimitStoreForTests,
  rateLimit,
  resolveRateLimitKey,
} from "../../src/lib/security/rate-limit";

test("rateLimit bloqueia acima do limite", () => {
  __resetRateLimitStoreForTests();

  const first = rateLimit({ key: "ip-1", max: 2, windowMs: 60_000 });
  const second = rateLimit({ key: "ip-1", max: 2, windowMs: 60_000 });
  const third = rateLimit({ key: "ip-1", max: 2, windowMs: 60_000 });

  assert.equal(first.allowed, true);
  assert.equal(second.allowed, true);
  assert.equal(third.allowed, false);
  assert.equal(third.remaining, 0);
});

test("resolveRateLimitKey prioriza x-forwarded-for", () => {
  const request = new Request("http://localhost", {
    headers: {
      "x-forwarded-for": "203.0.113.10, 10.0.0.1",
      "x-real-ip": "198.51.100.1",
    },
  });

  assert.equal(resolveRateLimitKey(request), "203.0.113.10");
});
