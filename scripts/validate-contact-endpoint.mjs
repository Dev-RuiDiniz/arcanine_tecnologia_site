import { spawn } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";

const BASE_URL = "http://127.0.0.1:3600";

const ensureServerReady = async (maxAttempts = 180) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch(`${BASE_URL}/contato`);
      if (response.ok) {
        return;
      }
    } catch {
      // booting
    }
    await wait(300);
  }
  throw new Error("Server not ready for contact endpoint validation.");
};

const validate = async () => {
  const csrfResponse = await fetch(`${BASE_URL}/api/csrf`);
  const csrfPayload = await csrfResponse.json();
  const csrfToken = csrfPayload?.data?.token;
  const csrfCookie = csrfResponse.headers.get("set-cookie");
  if (!csrfToken || !csrfCookie) {
    throw new Error("Unable to obtain CSRF token for contact endpoint validation.");
  }

  const csrfHeaders = {
    "x-csrf-token": csrfToken,
    Cookie: csrfCookie.split(";")[0],
  };

  const invalidResponse = await fetch(`${BASE_URL}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...csrfHeaders },
    body: JSON.stringify({ name: "A" }),
  });

  if (invalidResponse.status !== 400) {
    throw new Error(`Expected 400 for invalid payload, received ${invalidResponse.status}`);
  }

  const validResponse = await fetch(`${BASE_URL}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...csrfHeaders },
    body: JSON.stringify({
      name: "Contato Teste",
      email: "contato.teste@arcanine.com.br",
      phone: "+55 11 98888-7777",
      projectType: "site",
      message: "Mensagem de validacao automatica do endpoint de contato.",
    }),
  });

  const payload = await validResponse.json();
  if (validResponse.status === 500) {
    if (payload.ok || !payload.error) {
      throw new Error("Expected API error contract for contact submission failure.");
    }
    console.log("Contact endpoint accepted payload and returned monitored server error contract.");
    return;
  }

  if (!validResponse.ok || !payload.ok) {
    throw new Error(
      `Expected success or monitored failure contract, received ${validResponse.status}.`,
    );
  }

  console.log("Contact endpoint validation passed with successful submission.");
};

const run = async () => {
  const server = spawn("npm", ["run", "start", "--", "-p", "3600"], {
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
    await validate();
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
