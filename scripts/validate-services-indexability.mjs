import { spawn } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";

const BASE_URL = "http://127.0.0.1:3400";
const SERVICE_SLUGS = [
  "sites-institucionais",
  "sistemas-web",
  "automacoes",
  "integracoes-api",
  "ia-aplicada",
];

const ensureServerReady = async (maxAttempts = 60) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch(`${BASE_URL}/servicos`);
      if (response.ok) {
        return;
      }
    } catch {
      // still booting
    }
    await wait(300);
  }

  throw new Error("Server not ready for indexability validation.");
};

const validateHtml = (html, path) => {
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
  const response = await fetch(`${BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`${path}: returned status ${response.status}`);
  }

  const html = await response.text();
  validateHtml(html, path);
  console.log(`Indexability OK: ${path}`);
};

const run = async () => {
  const server = spawn("npm", ["run", "start", "--", "-p", "3400"], {
    stdio: "ignore",
    shell: true,
  });

  try {
    await ensureServerReady();
    await validatePath("/servicos");

    for (const slug of SERVICE_SLUGS) {
      await validatePath(`/servicos/${slug}`);
    }

    console.log("Services indexability validation passed.");
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
