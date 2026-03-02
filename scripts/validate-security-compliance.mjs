import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { createServer } from "node:net";
import { setTimeout as wait } from "node:timers/promises";

const require = createRequire(import.meta.url);
const START_PORT = 3960;

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

  throw new Error("No available port found for security compliance validation.");
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

  throw new Error("Server not ready for security compliance validation.");
};

const assertHeader = (headers, key, validator) => {
  const value = headers.get(key);
  if (!value || !validator(value)) {
    throw new Error(`Missing or invalid security header: ${key}`);
  }
};

const validateRootSecurityHeaders = async (baseUrl) => {
  const response = await fetch(`${baseUrl}/`, { signal: AbortSignal.timeout(3000) });
  if (!response.ok) {
    throw new Error(`Root route returned ${response.status}.`);
  }

  const { headers } = response;
  assertHeader(headers, "content-security-policy", (value) => {
    return value.includes("object-src 'none'") && value.includes("frame-ancestors 'none'");
  });
  assertHeader(headers, "x-content-type-options", (value) => value.toLowerCase() === "nosniff");
  assertHeader(headers, "x-frame-options", (value) => value.toUpperCase() === "DENY");
  assertHeader(headers, "referrer-policy", (value) =>
    value.includes("strict-origin-when-cross-origin"),
  );
  assertHeader(headers, "permissions-policy", (value) => value.includes("camera=()"));
  assertHeader(headers, "strict-transport-security", (value) => value.includes("max-age="));
};

const validateSeoTechnicalFiles = async (baseUrl) => {
  const [robotsResponse, sitemapResponse] = await Promise.all([
    fetch(`${baseUrl}/robots.txt`, { signal: AbortSignal.timeout(3000) }),
    fetch(`${baseUrl}/sitemap.xml`, { signal: AbortSignal.timeout(3000) }),
  ]);

  if (!robotsResponse.ok) {
    throw new Error(`robots.txt returned ${robotsResponse.status}.`);
  }

  if (!sitemapResponse.ok) {
    throw new Error(`sitemap.xml returned ${sitemapResponse.status}.`);
  }

  const robotsText = await robotsResponse.text();
  if (!robotsText.includes("Sitemap:")) {
    throw new Error("robots.txt does not include sitemap reference.");
  }
};

const run = async () => {
  const port = await findAvailablePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const nextBin = require.resolve("next/dist/bin/next");

  const server = spawn(process.execPath, [nextBin, "start", "-p", String(port)], {
    stdio: ["ignore", "pipe", "pipe"],
    shell: false,
    env: {
      ...process.env,
      AUTH_SECRET:
        process.env.AUTH_SECRET ||
        process.env.NEXTAUTH_SECRET ||
        "local-dev-auth-secret-for-security-compliance",
      NEXTAUTH_SECRET:
        process.env.NEXTAUTH_SECRET ||
        process.env.AUTH_SECRET ||
        "local-dev-auth-secret-for-security-compliance",
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

  try {
    await Promise.race([ensureServerReady(baseUrl), serverExit]);
    await validateRootSecurityHeaders(baseUrl);
    await validateSeoTechnicalFiles(baseUrl);
    console.log("Security compliance validation passed.");
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
