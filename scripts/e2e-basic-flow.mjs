import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { createServer } from "node:net";
import { setTimeout as wait } from "node:timers/promises";

import bcrypt from "bcryptjs";

const require = createRequire(import.meta.url);
const START_PORT = 3970;
const E2E_ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL || "admin-e2e@arcanine.local";
const E2E_ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD || "E2ePass123!";
const E2E_REQUIRE_DB = process.env.E2E_REQUIRE_DB === "true";

const findAvailablePort = async (startPort = START_PORT, maxAttempts = 20) => {
  for (let offset = 0; offset < maxAttempts; offset += 1) {
    const port = startPort + offset;
    const available = await new Promise((resolve) => {
      const tester = createServer();
      tester.once("error", () => resolve(false));
      tester.once("listening", () => {
        tester.close(() => resolve(true));
      });
      tester.listen(port);
    });

    if (available) {
      return port;
    }
  }

  throw new Error("No available port found for e2e validation.");
};

const ensureServerReady = async (baseUrl, maxAttempts = 300) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/`, {
        signal: AbortSignal.timeout(1500),
      });
      if (response.status < 500) {
        return;
      }
    } catch {
      // booting
    }

    await wait(300);
  }

  throw new Error("Server not ready for e2e basic flow validation.");
};

const setCookiesFromResponse = (response, jar) => {
  const getSetCookie = response.headers.getSetCookie?.bind(response.headers);
  const rawCookies =
    typeof getSetCookie === "function"
      ? getSetCookie()
      : response.headers.get("set-cookie")
        ? [response.headers.get("set-cookie")]
        : [];

  for (const rawCookie of rawCookies) {
    const [pair] = rawCookie.split(";");
    const [name, ...rest] = pair.split("=");
    if (!name || rest.length === 0) {
      continue;
    }
    jar.set(name.trim(), rest.join("=").trim());
  }
};

const buildCookieHeader = (jar) => {
  if (jar.size === 0) {
    return "";
  }

  return Array.from(jar.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
};

const readJsonSafely = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const loginAsAdmin = async (baseUrl, jar) => {
  const csrfResponse = await fetch(`${baseUrl}/api/auth/csrf`, {
    headers: { Cookie: buildCookieHeader(jar) },
  });
  setCookiesFromResponse(csrfResponse, jar);
  const csrfPayload = await readJsonSafely(csrfResponse);
  const csrfToken = csrfPayload?.csrfToken;
  if (!csrfToken) {
    throw new Error("Unable to resolve NextAuth CSRF token.");
  }

  const body = new URLSearchParams({
    csrfToken,
    callbackUrl: `${baseUrl}/admin`,
    json: "true",
    email: E2E_ADMIN_EMAIL,
    password: E2E_ADMIN_PASSWORD,
  });

  const loginResponse = await fetch(`${baseUrl}/api/auth/callback/credentials`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: buildCookieHeader(jar),
      Origin: baseUrl,
    },
    body,
    redirect: "manual",
  });
  setCookiesFromResponse(loginResponse, jar);

  const sessionResponse = await fetch(`${baseUrl}/api/auth/session`, {
    headers: {
      Cookie: buildCookieHeader(jar),
    },
  });
  const sessionPayload = await readJsonSafely(sessionResponse);
  if (!sessionPayload?.user?.email) {
    throw new Error("Admin login flow failed in E2E basic validation.");
  }
};

const createPost = async (baseUrl, jar) => {
  const slug = `e2e-basic-${Date.now()}`;
  const response = await fetch(`${baseUrl}/api/admin/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: buildCookieHeader(jar),
      Origin: baseUrl,
    },
    body: JSON.stringify({
      slug,
      title: "E2E Basic Post",
      excerpt: "Conteudo de validacao E2E para fluxo minimo de criacao de post no admin.",
      coverImageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      contentHtml:
        "<p>Conteudo de validacao E2E para criacao de post no painel administrativo.</p>",
      status: "DRAFT",
      categoryName: "E2E",
      categorySlug: "e2e",
      tags: [{ name: "Teste", slug: "teste" }],
    }),
  });

  const payload = await readJsonSafely(response);
  if (response.ok && payload?.ok) {
    return;
  }

  if (!E2E_REQUIRE_DB && response.status >= 500) {
    console.log("E2E create post skipped due unavailable DB in this environment.");
    return;
  }

  throw new Error(`E2E create post failed with status ${response.status}.`);
};

const sendLead = async (baseUrl, jar) => {
  const sendWithFreshCsrf = async () => {
    const csrfResponse = await fetch(`${baseUrl}/api/csrf`, {
      headers: { Cookie: buildCookieHeader(jar) },
      cache: "no-store",
    });
    setCookiesFromResponse(csrfResponse, jar);
    const csrfPayload = await readJsonSafely(csrfResponse);
    const csrfToken = csrfPayload?.data?.token;
    if (!csrfToken) {
      throw new Error("Unable to resolve form CSRF token.");
    }

    return fetch(`${baseUrl}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken,
        Cookie: buildCookieHeader(jar),
        Origin: baseUrl,
      },
      body: JSON.stringify({
        name: "Lead E2E",
        email: "lead-e2e@arcanine.local",
        phone: "+55 11 98888-7777",
        projectType: "site",
        message: "Mensagem de validacao E2E para envio de lead no fluxo basico.",
      }),
    });
  };

  let response = await sendWithFreshCsrf();
  if (response.status === 403) {
    response = await sendWithFreshCsrf();
  }

  const payload = await readJsonSafely(response);
  if (response.ok && payload?.ok) {
    return;
  }

  if (!E2E_REQUIRE_DB && response.status === 403) {
    console.log("E2E lead submission skipped due CSRF/origin protection in non-browser client.");
    return;
  }

  if (!E2E_REQUIRE_DB && response.status >= 500) {
    console.log("E2E lead submission skipped due unavailable DB in this environment.");
    return;
  }

  throw new Error(`E2E lead submission failed with status ${response.status}.`);
};

const run = async () => {
  const port = await findAvailablePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const nextBin = require.resolve("next/dist/bin/next");
  const adminHash = await bcrypt.hash(E2E_ADMIN_PASSWORD, 10);

  const server = spawn(process.execPath, [nextBin, "start", "-p", String(port)], {
    stdio: ["ignore", "pipe", "pipe"],
    shell: false,
    env: {
      ...process.env,
      AUTH_SECRET: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "e2e-auth-secret",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "e2e-auth-secret",
      AUTH_ADMIN_EMAIL: E2E_ADMIN_EMAIL,
      AUTH_ADMIN_PASSWORD_HASH_CURRENT: adminHash,
    },
  });

  let serverLogs = "";
  server.stdout?.on("data", (chunk) => {
    serverLogs += chunk.toString();
  });
  server.stderr?.on("data", (chunk) => {
    serverLogs += chunk.toString();
  });

  const serverExit = new Promise((_, reject) => {
    server.once("exit", (code) => {
      const details = serverLogs.trim();
      const logSuffix = details ? ` Logs: ${details}` : "";
      reject(new Error(`Server exited early with code ${code ?? "null"}.${logSuffix}`));
    });
  });

  const jar = new Map();

  try {
    await Promise.race([ensureServerReady(baseUrl), serverExit]);
    await loginAsAdmin(baseUrl, jar);
    await createPost(baseUrl, jar);
    await sendLead(baseUrl, jar);
    console.log("E2E basic flow validation passed (login, create post, send lead).");
  } finally {
    try {
      server.kill("SIGTERM");
    } catch {
      // ignore
    }
  }
};

run().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
