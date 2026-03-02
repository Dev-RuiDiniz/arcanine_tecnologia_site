import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { createServer } from "node:net";
import { setTimeout as wait } from "node:timers/promises";

const START_PORT = 3920;
const require = createRequire(import.meta.url);

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
  throw new Error("No available port found for sensitive access validation.");
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
  throw new Error("Server not ready for sensitive access validation.");
};

const expectUnauthorized = async (baseUrl, path) => {
  const response = await fetch(`${baseUrl}${path}`, {
    signal: AbortSignal.timeout(3000),
  });
  if (response.status !== 401 && response.status !== 403) {
    const body = await response.text();
    throw new Error(
      `${path}: expected 401/403, received ${response.status}. body=${body.slice(0, 300)}`,
    );
  }
};

const validateCsvShape = async (baseUrl) => {
  const response = await fetch(`${baseUrl}/api/admin/leads/export`, {
    signal: AbortSignal.timeout(3000),
  });
  if (response.status !== 401 && response.status !== 403) {
    throw new Error(`CSV export should be protected; got ${response.status}`);
  }
};

const run = async () => {
  const port = await findAvailablePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const nextBin = require.resolve("next/dist/bin/next");
  const authSecret =
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "local-dev-auth-secret-for-sensitive-validation";
  const server = spawn(process.execPath, [nextBin, "start", "-p", String(port)], {
    stdio: ["ignore", "pipe", "pipe"],
    shell: false,
    env: {
      ...process.env,
      AUTH_SECRET: authSecret,
      NEXTAUTH_SECRET: authSecret,
    },
  });
  let serverLogs = "";
  server.stdout?.on("data", (chunk) => {
    serverLogs += chunk.toString();
  });
  server.stderr?.on("data", (chunk) => {
    serverLogs += chunk.toString();
  });

  const serverError = new Promise((_, reject) => {
    server.once("error", (error) => {
      reject(new Error(`Failed to spawn Next server: ${error.message}`));
    });
  });

  const serverExit = new Promise((_, reject) => {
    server.once("exit", (code) => {
      const details = serverLogs.trim();
      const logSuffix = details ? ` Logs: ${details}` : "";
      reject(new Error(`Server exited early with code ${code ?? "null"}.${logSuffix}`));
    });
  });

  try {
    await Promise.race([ensureServerReady(baseUrl), serverExit, serverError]);
    await expectUnauthorized(baseUrl, "/api/admin/leads");
    await validateCsvShape(baseUrl);
    await expectUnauthorized(baseUrl, "/api/admin/settings/users");
    console.log("Sensitive access protection validation passed.");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const details = serverLogs.trim();
    const logSuffix = details ? ` Logs: ${details}` : "";
    throw new Error(`${message}${logSuffix}`);
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
