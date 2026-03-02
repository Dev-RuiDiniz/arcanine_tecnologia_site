import { spawn } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";

const BASE_URL = "http://127.0.0.1:3700";
const LEGAL_ROUTES = ["/politica-de-privacidade", "/termos-de-uso"];

const ensureServerReady = async (maxAttempts = 180) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch(`${BASE_URL}${LEGAL_ROUTES[0]}`);
      if (response.ok) {
        return;
      }
    } catch {
      // still booting
    }

    await wait(300);
  }

  throw new Error("Server not ready for legal preview validation.");
};

const validateRoute = async (path) => {
  const response = await fetch(`${BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`${path}: returned status ${response.status}`);
  }

  const html = await response.text();

  if (!html.includes("<title>")) {
    throw new Error(`${path}: missing <title> tag`);
  }

  if (!html.includes('name="description"')) {
    throw new Error(`${path}: missing meta description`);
  }

  console.log(`Legal preview route OK: ${path}`);
};

const run = async () => {
  const server = spawn("npm", ["run", "start", "--", "-p", "3700"], {
    stdio: "ignore",
    shell: true,
    env: {
      ...process.env,
      VERCEL_ENV: "preview",
    },
  });

  const serverExit = new Promise((_, reject) => {
    server.once("exit", (code) => {
      reject(new Error(`Server exited early with code ${code ?? "null"}.`));
    });
  });

  try {
    await Promise.race([ensureServerReady(), serverExit]);

    for (const route of LEGAL_ROUTES) {
      await validateRoute(route);
    }

    console.log("Legal preview routes validation passed.");
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
