"use client";

import { useState } from "react";

import type { ApiResult } from "@/lib/api/contracts";

type GeneralSettings = {
  companyName: string;
  email: string;
  phone: string;
  whatsapp: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressZip: string;
  addressCountry: string;
  socialLinksJson: string;
  mapEmbedUrl?: string;
  integrations: {
    formErrorsWebhookUrl?: string;
    emailErrorsWebhookUrl?: string;
    gaId?: string;
    plausibleDomain?: string;
  };
};

type AdminUserPermission = {
  id: string;
  email: string;
  sourceRole: "ADMIN" | "EDITOR" | "VIEWER";
  role: "ADMIN" | "EDITOR" | "VIEWER";
  active: boolean;
  name: string;
};

type SettingsManagerProps = {
  initialGeneral: GeneralSettings;
  initialUsers: AdminUserPermission[];
};

export const SettingsManager = ({ initialGeneral, initialUsers }: SettingsManagerProps) => {
  const [general, setGeneral] = useState<GeneralSettings>(initialGeneral);
  const [users, setUsers] = useState<AdminUserPermission[]>(initialUsers);
  const [tab, setTab] = useState<"general" | "users">("general");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const saveGeneral = async () => {
    setFeedback(null);
    setIsError(false);
    try {
      const response = await fetch("/api/admin/settings/general", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(general),
      });
      const payload = (await response.json()) as ApiResult<{ updated: true }>;
      if (!response.ok || !payload.ok) {
        setIsError(true);
        setFeedback(payload.ok ? "Falha ao salvar configuracoes." : payload.error);
        return;
      }
      setFeedback("Configuracoes gerais atualizadas.");
    } catch {
      setIsError(true);
      setFeedback("Falha de conexao ao salvar configuracoes.");
    }
  };

  const saveUsers = async () => {
    setFeedback(null);
    setIsError(false);
    try {
      const response = await fetch("/api/admin/settings/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          users: users.map((user) => ({
            email: user.email,
            role: user.role,
            active: user.active,
          })),
        }),
      });
      const payload = (await response.json()) as ApiResult<{ updated: true }>;
      if (!response.ok || !payload.ok) {
        setIsError(true);
        setFeedback(payload.ok ? "Falha ao salvar usuarios/permissoes." : payload.error);
        return;
      }
      setFeedback("Usuarios/permissoes atualizados.");
    } catch {
      setIsError(true);
      setFeedback("Falha de conexao ao salvar usuarios/permissoes.");
    }
  };

  return (
    <section className="space-y-4">
      <header className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
        <h2 className="text-lg font-semibold text-zinc-900">Configuracoes gerais</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Empresa, redes, WhatsApp, integracoes e usuarios/permissoes.
        </p>
      </header>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab("general")}
          className={`rounded-md border px-3 py-2 text-sm ${
            tab === "general"
              ? "border-zinc-900 bg-zinc-900 text-white"
              : "border-zinc-200 bg-white"
          }`}
        >
          Geral
        </button>
        <button
          type="button"
          onClick={() => setTab("users")}
          className={`rounded-md border px-3 py-2 text-sm ${
            tab === "users" ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 bg-white"
          }`}
        >
          Usuarios/Permissoes
        </button>
      </div>

      {tab === "general" ? (
        <article className="space-y-3 rounded-md border border-zinc-200 bg-white p-4">
          <div className="grid gap-2 md:grid-cols-2">
            <input
              value={general.companyName}
              onChange={(event) =>
                setGeneral((prev) => ({ ...prev, companyName: event.target.value }))
              }
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
              placeholder="Empresa"
            />
            <input
              value={general.email}
              onChange={(event) => setGeneral((prev) => ({ ...prev, email: event.target.value }))}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
              placeholder="Email"
            />
            <input
              value={general.phone}
              onChange={(event) => setGeneral((prev) => ({ ...prev, phone: event.target.value }))}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
              placeholder="Telefone"
            />
            <input
              value={general.whatsapp}
              onChange={(event) =>
                setGeneral((prev) => ({ ...prev, whatsapp: event.target.value }))
              }
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
              placeholder="WhatsApp"
            />
          </div>
          <div className="grid gap-2 md:grid-cols-3">
            <input
              value={general.addressStreet}
              onChange={(event) =>
                setGeneral((prev) => ({ ...prev, addressStreet: event.target.value }))
              }
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
              placeholder="Rua"
            />
            <input
              value={general.addressCity}
              onChange={(event) =>
                setGeneral((prev) => ({ ...prev, addressCity: event.target.value }))
              }
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
              placeholder="Cidade"
            />
            <input
              value={general.addressState}
              onChange={(event) =>
                setGeneral((prev) => ({ ...prev, addressState: event.target.value }))
              }
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
              placeholder="Estado"
            />
            <input
              value={general.addressZip}
              onChange={(event) =>
                setGeneral((prev) => ({ ...prev, addressZip: event.target.value }))
              }
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
              placeholder="CEP"
            />
            <input
              value={general.addressCountry}
              onChange={(event) =>
                setGeneral((prev) => ({ ...prev, addressCountry: event.target.value }))
              }
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
              placeholder="Pais"
            />
            <input
              value={general.mapEmbedUrl || ""}
              onChange={(event) =>
                setGeneral((prev) => ({ ...prev, mapEmbedUrl: event.target.value }))
              }
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
              placeholder="Map embed URL"
            />
          </div>
          <textarea
            value={general.socialLinksJson}
            onChange={(event) =>
              setGeneral((prev) => ({ ...prev, socialLinksJson: event.target.value }))
            }
            className="min-h-24 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            placeholder='JSON de redes: [{"label":"LinkedIn","href":"https://..."}]'
          />
          <div className="grid gap-2 md:grid-cols-2">
            <input
              value={general.integrations.formErrorsWebhookUrl || ""}
              onChange={(event) =>
                setGeneral((prev) => ({
                  ...prev,
                  integrations: {
                    ...prev.integrations,
                    formErrorsWebhookUrl: event.target.value,
                  },
                }))
              }
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
              placeholder="Webhook erros formulario"
            />
            <input
              value={general.integrations.emailErrorsWebhookUrl || ""}
              onChange={(event) =>
                setGeneral((prev) => ({
                  ...prev,
                  integrations: {
                    ...prev.integrations,
                    emailErrorsWebhookUrl: event.target.value,
                  },
                }))
              }
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
              placeholder="Webhook erros e-mail"
            />
            <input
              value={general.integrations.gaId || ""}
              onChange={(event) =>
                setGeneral((prev) => ({
                  ...prev,
                  integrations: { ...prev.integrations, gaId: event.target.value },
                }))
              }
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
              placeholder="GA ID"
            />
            <input
              value={general.integrations.plausibleDomain || ""}
              onChange={(event) =>
                setGeneral((prev) => ({
                  ...prev,
                  integrations: { ...prev.integrations, plausibleDomain: event.target.value },
                }))
              }
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
              placeholder="Plausible domain"
            />
          </div>
          <button
            type="button"
            onClick={() => void saveGeneral()}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Salvar configuracoes
          </button>
        </article>
      ) : null}

      {tab === "users" ? (
        <article className="space-y-3 rounded-md border border-zinc-200 bg-white p-4">
          {users.map((user, index) => (
            <div
              key={user.email}
              className="grid gap-2 rounded border border-zinc-200 p-3 md:grid-cols-4"
            >
              <div>
                <p className="text-sm font-semibold text-zinc-900">{user.name}</p>
                <p className="text-xs text-zinc-500">{user.email}</p>
              </div>
              <p className="text-xs text-zinc-600">Role original: {user.sourceRole}</p>
              <select
                value={user.role}
                onChange={(event) =>
                  setUsers((prev) =>
                    prev.map((item, itemIndex) =>
                      itemIndex === index
                        ? { ...item, role: event.target.value as AdminUserPermission["role"] }
                        : item,
                    ),
                  )
                }
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
              >
                <option value="ADMIN">ADMIN</option>
                <option value="EDITOR">EDITOR</option>
                <option value="VIEWER">VIEWER</option>
              </select>
              <label className="inline-flex items-center gap-2 text-sm text-zinc-700">
                <input
                  type="checkbox"
                  checked={user.active}
                  onChange={(event) =>
                    setUsers((prev) =>
                      prev.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, active: event.target.checked } : item,
                      ),
                    )
                  }
                />
                Ativo
              </label>
            </div>
          ))}
          <button
            type="button"
            onClick={() => void saveUsers()}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Salvar usuarios/permissoes
          </button>
        </article>
      ) : null}

      {feedback ? (
        <p
          className={`rounded-md px-3 py-2 text-sm ${
            isError ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {feedback}
        </p>
      ) : null}
    </section>
  );
};
