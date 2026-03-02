import { spawn } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";

const BASE_URL = "http://127.0.0.1:3200/sobre";

const ensureServerReady = async (maxAttempts = 60) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch(BASE_URL);
      if (response.ok) {
        return;
      }
    } catch {
      // still booting
    }
    await wait(300);
  }
  throw new Error("Server not ready in time for /sobre validation.");
};

const measureRequests = async (samples = 5) => {
  const durations = [];

  for (let index = 0; index < samples; index += 1) {
    const start = performance.now();
    const response = await fetch(BASE_URL);
    const end = performance.now();

    if (!response.ok) {
      throw new Error(`/sobre returned ${response.status}`);
    }

    durations.push(end - start);
    await wait(150);
  }

  const avg = durations.reduce((acc, value) => acc + value, 0) / durations.length;
  const min = Math.min(...durations);
  const max = Math.max(...durations);

  return { avg, min, max };
};

const runForEnv = async (envName) => {
  const serverProcess = spawn("npm", ["run", "start", "--", "-p", "3200"], {
    stdio: "ignore",
    shell: true,
    env: {
      ...process.env,
      VERCEL_ENV: envName,
    },
  });

  try {
    await ensureServerReady();
    const metrics = await measureRequests();
    console.log(
      `[${envName}] /sobre avg=${metrics.avg.toFixed(1)}ms min=${metrics.min.toFixed(1)}ms max=${metrics.max.toFixed(1)}ms`,
    );
  } finally {
    try {
      serverProcess.kill("SIGTERM");
    } catch {
      // ignore
    }
    await wait(400);
  }
};

const main = async () => {
  await runForEnv("development");
  await runForEnv("preview");
};

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
