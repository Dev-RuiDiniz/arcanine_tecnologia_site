import test from "node:test";
import assert from "node:assert/strict";

import { budgetLeadSchema } from "../../src/schemas/forms/budget";
import { contactLeadSchema } from "../../src/schemas/forms/contact";

test("contactLeadSchema valida payload minimo", () => {
  const parsed = contactLeadSchema.safeParse({
    name: "Contato Teste",
    email: "contato@empresa.com",
    phone: "+55 11 99999-9999",
    projectType: "site",
    message: "Mensagem valida com detalhes suficientes para analise.",
  });

  assert.equal(parsed.success, true);
});

test("budgetLeadSchema rejeita projectBrief curto", () => {
  const parsed = budgetLeadSchema.safeParse({
    contactName: "Contato Teste",
    companyName: "Empresa X",
    email: "contato@empresa.com",
    phone: "+55 11 99999-9999",
    service: "Site institucional",
    budgetRange: "R$ 10 mil a R$ 30 mil",
    timeline: "1 a 3 meses",
    projectBrief: "curto",
  });

  assert.equal(parsed.success, false);
});
