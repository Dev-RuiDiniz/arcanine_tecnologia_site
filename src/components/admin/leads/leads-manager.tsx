"use client";

import { useMemo, useState } from "react";

import type { ApiResult } from "@/lib/api/contracts";

type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "LOST";

type AdminLead = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  projectType?: string;
  message: string;
  source: "CONTACT_FORM" | "BUDGET_FORM";
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
  notes: {
    id: string;
    note: string;
    authorEmail?: string;
    createdAt: string;
  }[];
};

type LeadsManagerProps = {
  initialLeads: AdminLead[];
};

export const LeadsManager = ({ initialLeads }: LeadsManagerProps) => {
  const [leads, setLeads] = useState<AdminLead[]>(initialLeads);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [status, setStatus] = useState("");
  const [service, setService] = useState("");
  const [query, setQuery] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    if (status) params.set("status", status);
    if (service) params.set("service", service);
    if (query) params.set("q", query);
    return params.toString();
  }, [dateFrom, dateTo, status, service, query]);

  const refresh = async () => {
    setFeedback(null);
    setIsError(false);
    try {
      const response = await fetch(`/api/admin/leads${queryString ? `?${queryString}` : ""}`, {
        cache: "no-store",
      });
      const payload = (await response.json()) as ApiResult<AdminLead[]>;
      if (!response.ok || !payload.ok) {
        setIsError(true);
        setFeedback(payload.ok ? "Falha ao carregar leads." : payload.error);
        return;
      }
      setLeads(payload.data);
    } catch {
      setIsError(true);
      setFeedback("Falha de conexao ao carregar leads.");
    }
  };

  const updateStatus = async (leadId: string, nextStatus: LeadStatus, note: string) => {
    setFeedback(null);
    setIsError(false);
    try {
      const response = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId,
          status: nextStatus,
          note: note.trim() || undefined,
        }),
      });
      const payload = (await response.json()) as ApiResult<{ updated: true }>;
      if (!response.ok || !payload.ok) {
        setIsError(true);
        setFeedback(payload.ok ? "Falha ao atualizar lead." : payload.error);
        return;
      }
      await refresh();
      setFeedback("Lead atualizado com sucesso.");
    } catch {
      setIsError(true);
      setFeedback("Falha de conexao ao atualizar lead.");
    }
  };

  const exportUrl = `/api/admin/leads/export${queryString ? `?${queryString}` : ""}`;

  return (
    <section className="space-y-4">
      <header className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
        <h2 className="text-lg font-semibold text-zinc-900">Leads</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Filtros por data, status e servico com exportacao CSV e notas internas.
        </p>
      </header>

      <div className="grid gap-3 rounded-md border border-zinc-200 bg-white p-4 md:grid-cols-6">
        <input
          type="date"
          value={dateFrom}
          onChange={(event) => setDateFrom(event.target.value)}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(event) => setDateTo(event.target.value)}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
        >
          <option value="">Todos status</option>
          <option value="NEW">NEW</option>
          <option value="CONTACTED">CONTACTED</option>
          <option value="QUALIFIED">QUALIFIED</option>
          <option value="LOST">LOST</option>
        </select>
        <input
          value={service}
          onChange={(event) => setService(event.target.value)}
          placeholder="Servico"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar nome/email"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void refresh()}
            className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-semibold text-white"
          >
            Filtrar
          </button>
          <a
            href={exportUrl}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100"
          >
            Exportar CSV
          </a>
        </div>
      </div>

      <div className="space-y-3">
        {leads.map((lead) => (
          <article key={lead.id} className="rounded-md border border-zinc-200 bg-white p-4">
            <div className="grid gap-2 md:grid-cols-[1fr_auto]">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900">
                  {lead.name} · {lead.email}
                </h3>
                <p className="text-xs text-zinc-500">
                  {lead.projectType || "Sem servico"} · {lead.source} · {lead.createdAt}
                </p>
                <p className="mt-2 text-sm text-zinc-700">{lead.message}</p>
              </div>

              <div className="space-y-2">
                <StatusForm
                  lead={lead}
                  onSubmit={(nextStatus, note) => void updateStatus(lead.id, nextStatus, note)}
                />
              </div>
            </div>

            {lead.notes.length > 0 ? (
              <div className="mt-3 rounded border border-zinc-200 bg-zinc-50 p-3">
                <p className="text-xs font-semibold text-zinc-700">Observacoes internas</p>
                <div className="mt-2 space-y-2">
                  {lead.notes.map((note) => (
                    <div key={note.id} className="text-xs text-zinc-600">
                      <p>{note.note}</p>
                      <p className="text-[11px] text-zinc-500">
                        {note.authorEmail || "sistema"} · {note.createdAt}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </article>
        ))}
      </div>

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

const StatusForm = ({
  lead,
  onSubmit,
}: {
  lead: AdminLead;
  onSubmit: (status: LeadStatus, note: string) => void;
}) => {
  const [nextStatus, setNextStatus] = useState<LeadStatus>(lead.status);
  const [note, setNote] = useState("");

  return (
    <div className="w-64 space-y-2 rounded border border-zinc-200 p-2">
      <select
        value={nextStatus}
        onChange={(event) => setNextStatus(event.target.value as LeadStatus)}
        className="w-full rounded-md border border-zinc-300 px-2 py-1 text-xs"
      >
        <option value="NEW">NEW</option>
        <option value="CONTACTED">CONTACTED</option>
        <option value="QUALIFIED">QUALIFIED</option>
        <option value="LOST">LOST</option>
      </select>
      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="Observacao interna"
        className="min-h-16 w-full rounded-md border border-zinc-300 px-2 py-1 text-xs"
      />
      <button
        type="button"
        onClick={() => onSubmit(nextStatus, note)}
        className="w-full rounded-md bg-zinc-900 px-2 py-1 text-xs font-semibold text-white"
      >
        Atualizar
      </button>
    </div>
  );
};
