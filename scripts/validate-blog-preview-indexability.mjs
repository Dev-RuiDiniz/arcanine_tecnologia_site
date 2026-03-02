import { spawn } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";

const BASE_URL = "http://127.0.0.1:3910";

const ensureServerReady = async (maxAttempts = 180) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch(`${BASE_URL}/insights`);
      if (response.ok) {
        return;
      }
    } catch {
      // still booting
    }
    await wait(300);
  }
  throw new Error("Server not ready for blog preview validation.");
};

const validateIndexability = (html, path) => {
  if (!html.includes("<title>")) {
    throw new Error(`${path}: missing <title> tag`);
  }
  if (!html.includes('name="description"')) {
    throw new Error(`${path}: missing meta description`);
  }
  if (html.toLowerCase().includes("noindex")) {
    throw new Error(`${path}: contains noindex directive`);
  }
};

const validatePath = async (path) => {
  const start = performance.now();
  const response = await fetch(`${BASE_URL}${path}`);
  const end = performance.now();

  if (!response.ok) {
    throw new Error(`${path}: returned ${response.status}`);
  }

  const html = await response.text();
  validateIndexability(html, path);
  return end - start;
};

const run = async () => {
  const server = spawn("npx", ["next", "start", "-p", "3910"], {
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

    const insightsDuration = await validatePath("/insights");
    const articleDuration = await validatePath(
      "/insights/como-estruturar-site-corporativo-que-converte",
    );

    const avgDuration = (insightsDuration + articleDuration) / 2;
    if (avgDuration > 3000) {
      throw new Error(
        `Blog preview average response too slow: ${avgDuration.toFixed(1)}ms (> 3000ms).`,
      );
    }

    console.log(
      `Blog preview indexability/performance passed. avg=${avgDuration.toFixed(1)}ms insights=${insightsDuration.toFixed(1)}ms article=${articleDuration.toFixed(1)}ms`,
    );
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
