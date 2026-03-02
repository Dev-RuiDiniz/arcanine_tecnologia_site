import { spawn } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";

const BASE_URL = "http://127.0.0.1:3500";
const ALLOWED_HOSTS = new Set(["res.cloudinary.com", "images.unsplash.com"]);

if (process.env.CASES_CDN_BASE_URL) {
  try {
    ALLOWED_HOSTS.add(new URL(process.env.CASES_CDN_BASE_URL).hostname);
  } catch {
    // ignore invalid env
  }
}

const ensureServerReady = async (maxAttempts = 140) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch(`${BASE_URL}/api/public/cases`);
      if (response.ok) {
        return;
      }
    } catch {
      // booting
    }
    await wait(300);
  }
  throw new Error("Server not ready for CDN validation.");
};

const validateCaseImages = async () => {
  const response = await fetch(`${BASE_URL}/api/public/cases`);
  if (!response.ok) {
    throw new Error(`/api/public/cases returned ${response.status}`);
  }

  const payload = await response.json();
  if (!payload.ok || !Array.isArray(payload.data)) {
    throw new Error("Unexpected cases API payload.");
  }

  for (const caseItem of payload.data) {
    for (const imageUrl of caseItem.imageUrls ?? []) {
      const host = new URL(imageUrl).hostname;
      if (!ALLOWED_HOSTS.has(host)) {
        throw new Error(`Case ${caseItem.slug} uses non-CDN host: ${host}`);
      }
    }
  }

  console.log(`CDN delivery validation passed for ${payload.data.length} case(s).`);
};

const run = async () => {
  const server = spawn("npm", ["run", "start", "--", "-p", "3500"], {
    stdio: "ignore",
    shell: true,
  });

  const serverExit = new Promise((_, reject) => {
    server.once("exit", (code) => {
      reject(new Error(`Server exited early with code ${code ?? "null"}.`));
    });
  });

  try {
    await Promise.race([ensureServerReady(), serverExit]);
    await validateCaseImages();
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
