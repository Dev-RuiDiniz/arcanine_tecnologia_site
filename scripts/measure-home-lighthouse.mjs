import { mkdirSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";

import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";

const BASE_URL = "http://127.0.0.1:3100";
const REPORT_DIR = "reports";
const REPORT_PATH = `${REPORT_DIR}/lighthouse-home.json`;

const withTimeout = async (promise, timeoutMs, message) => {
  return Promise.race([
    promise,
    wait(timeoutMs).then(() => {
      throw new Error(message);
    }),
  ]);
};

const ensureServerReady = async (maxAttempts = 50) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch(BASE_URL);
      if (response.ok) {
        return;
      }
    } catch {
      // server is still starting
    }
    await wait(400);
  }

  throw new Error("Server did not become ready for Lighthouse measurement.");
};

const run = async () => {
  mkdirSync(REPORT_DIR, { recursive: true });

  const serverProcess = spawn("npm", ["run", "start", "--", "-p", "3100"], {
    stdio: "ignore",
    shell: true,
  });

  const processExitPromise = new Promise((_, reject) => {
    serverProcess.once("exit", (code) => {
      reject(new Error(`Server process exited before Lighthouse run (code: ${code ?? "null"}).`));
    });
  });

  let chrome;
  try {
    await withTimeout(
      Promise.race([ensureServerReady(), processExitPromise]),
      30000,
      "Server startup timeout.",
    );

    chrome = await withTimeout(
      launch({
        chromeFlags: ["--headless", "--no-sandbox", "--disable-gpu"],
      }),
      20000,
      "Chrome launch timeout.",
    );

    const lighthouseResult = await withTimeout(
      lighthouse(BASE_URL, {
        port: chrome.port,
        output: "json",
        logLevel: "error",
        onlyCategories: ["performance"],
      }),
      120000,
      "Lighthouse audit timeout.",
    );

    if (!lighthouseResult || !lighthouseResult.report) {
      throw new Error("Lighthouse did not return a valid report.");
    }

    writeFileSync(REPORT_PATH, lighthouseResult.report);

    const perfScore = lighthouseResult.lhr.categories.performance.score ?? 0;
    const firstContentfulPaint =
      lighthouseResult.lhr.audits["first-contentful-paint"]?.displayValue;
    const largestContentfulPaint =
      lighthouseResult.lhr.audits["largest-contentful-paint"]?.displayValue;
    const totalBlockingTime = lighthouseResult.lhr.audits["total-blocking-time"]?.displayValue;
    const cumulativeLayoutShift =
      lighthouseResult.lhr.audits["cumulative-layout-shift"]?.displayValue;

    const scorePercent = Math.round(perfScore * 100);
    console.log(`Lighthouse performance score: ${scorePercent}`);
    console.log(`FCP: ${firstContentfulPaint}`);
    console.log(`LCP: ${largestContentfulPaint}`);
    console.log(`TBT: ${totalBlockingTime}`);
    console.log(`CLS: ${cumulativeLayoutShift}`);
    console.log(`Report saved at: ${REPORT_PATH}`);
  } finally {
    if (chrome) {
      try {
        await chrome.kill();
      } catch {
        // Ignore chrome temp cleanup issues on Windows (EBUSY).
      }
    }

    try {
      serverProcess.kill("SIGTERM");
    } catch {
      // Ignore process shutdown race conditions.
    }
  }
};

run().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
