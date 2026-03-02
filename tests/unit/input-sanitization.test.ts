import test from "node:test";
import assert from "node:assert/strict";

import {
  sanitizeOptionalPlainText,
  sanitizePlainText,
} from "../../src/lib/security/input-sanitization";

test("sanitizePlainText remove HTML/XSS e normaliza whitespace", () => {
  const raw = "  <script>alert('x')</script> Ola   <b>Mundo</b> \n\n\n teste  ";
  const sanitized = sanitizePlainText(raw);

  assert.equal(sanitized.includes("<script>"), false);
  assert.equal(sanitized.includes("<b>"), false);
  assert.equal(sanitized, "Ola Mundo \n\n teste");
});

test("sanitizeOptionalPlainText retorna undefined para vazio", () => {
  assert.equal(sanitizeOptionalPlainText(undefined), undefined);
  assert.equal(sanitizeOptionalPlainText("   "), undefined);
  assert.equal(sanitizeOptionalPlainText("<i>ok</i>"), "ok");
});
