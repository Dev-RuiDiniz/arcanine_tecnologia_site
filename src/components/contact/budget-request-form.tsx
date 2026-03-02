"use client";

import { useMemo, useState } from "react";

import { submitBudgetForm } from "@/lib/api/forms";
import { budgetLeadSchema } from "@/schemas/forms/budget";

type BudgetRequestFormProps = {
  maxAttachmentSizeMb: number;
  allowedAttachmentMimeTypes: string[];
};

const serviceOptions = [
  "Site institucional",
  "Sistema web",
  "Automacao de processos",
  "Integracao de APIs",
  "IA aplicada",
];

const budgetRangeOptions = [
  "Ate R$ 10 mil",
  "R$ 10 mil a R$ 30 mil",
  "R$ 30 mil a R$ 80 mil",
  "Acima de R$ 80 mil",
];

const timelineOptions = ["Urgente (ate 30 dias)", "1 a 3 meses", "3 a 6 meses", "Mais de 6 meses"];

export const BudgetRequestForm = ({
  maxAttachmentSizeMb,
  allowedAttachmentMimeTypes,
}: BudgetRequestFormProps) => {
  const [contactName, setContactName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(serviceOptions[0]);
  const [budgetRange, setBudgetRange] = useState(budgetRangeOptions[1]);
  const [timeline, setTimeline] = useState(timelineOptions[1]);
  const [projectBrief, setProjectBrief] = useState("");
  const [attachment, setAttachment] = useState<File | undefined>();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null);

  const acceptedFileTypes = useMemo(
    () => allowedAttachmentMimeTypes.join(","),
    [allowedAttachmentMimeTypes],
  );

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setFeedback(null);
    setIsError(false);
    setFieldErrors({});
    setWhatsappLink(null);

    const parsed = budgetLeadSchema.safeParse({
      contactName,
      companyName,
      email,
      phone,
      service,
      budgetRange,
      timeline,
      projectBrief,
    });

    if (!parsed.success) {
      setLoading(false);
      setIsError(true);
      setFeedback("Revise os campos obrigatorios do formulario de orcamento.");
      setFieldErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    if (attachment) {
      const maxSizeBytes = maxAttachmentSizeMb * 1024 * 1024;
      if (attachment.size > maxSizeBytes) {
        setLoading(false);
        setIsError(true);
        setFeedback(`O anexo ultrapassa o limite de ${maxAttachmentSizeMb}MB.`);
        setFieldErrors({ attachment: [`Tamanho maximo: ${maxAttachmentSizeMb}MB`] });
        return;
      }

      if (!allowedAttachmentMimeTypes.includes(attachment.type)) {
        setLoading(false);
        setIsError(true);
        setFeedback("Tipo de arquivo nao permitido para anexo.");
        setFieldErrors({ attachment: ["Formato invalido para upload"] });
        return;
      }
    }

    try {
      const payload = await submitBudgetForm(parsed.data, attachment);
      if (!payload.ok) {
        setIsError(true);
        setFeedback(payload.error || "Nao foi possivel enviar a solicitacao de orcamento.");
        if (
          payload.issues &&
          typeof payload.issues === "object" &&
          "fieldErrors" in payload.issues
        ) {
          setFieldErrors(
            (payload.issues as { fieldErrors?: Record<string, string[]> }).fieldErrors || {},
          );
        }
        return;
      }

      const deliveryStatus =
        payload.data.internalNotificationSent && payload.data.clientConfirmationSent
          ? "Notificacoes por e-mail enviadas."
          : "Lead salvo, mas houve falha parcial no envio de e-mails.";
      setFeedback(`Solicitacao enviada com sucesso. ${deliveryStatus}`);
      setWhatsappLink(payload.data.whatsappLink || null);
      setContactName("");
      setCompanyName("");
      setEmail("");
      setPhone("");
      setService(serviceOptions[0]);
      setBudgetRange(budgetRangeOptions[1]);
      setTimeline(timelineOptions[1]);
      setProjectBrief("");
      setAttachment(undefined);
    } catch {
      setIsError(true);
      setFeedback("Falha de conexao ao enviar solicitacao de orcamento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      aria-busy={loading}
      className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-zinc-900">Solicitar orcamento</h2>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-zinc-700">Nome do responsavel</span>
        <input
          required
          value={contactName}
          onChange={(event) => setContactName(event.target.value)}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          placeholder="Nome completo"
        />
        {fieldErrors.contactName?.[0] ? (
          <span className="mt-1 block text-xs text-red-600">{fieldErrors.contactName[0]}</span>
        ) : null}
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-zinc-700">Empresa</span>
        <input
          required
          value={companyName}
          onChange={(event) => setCompanyName(event.target.value)}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          placeholder="Nome da empresa"
        />
        {fieldErrors.companyName?.[0] ? (
          <span className="mt-1 block text-xs text-red-600">{fieldErrors.companyName[0]}</span>
        ) : null}
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-zinc-700">E-mail</span>
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
            placeholder="voce@empresa.com"
          />
          {fieldErrors.email?.[0] ? (
            <span className="mt-1 block text-xs text-red-600">{fieldErrors.email[0]}</span>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-zinc-700">Telefone</span>
          <input
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
            placeholder="+55 11 99999-9999"
          />
          {fieldErrors.phone?.[0] ? (
            <span className="mt-1 block text-xs text-red-600">{fieldErrors.phone[0]}</span>
          ) : null}
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-zinc-700">Servico</span>
          <select
            value={service}
            onChange={(event) => setService(event.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          >
            {serviceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {fieldErrors.service?.[0] ? (
            <span className="mt-1 block text-xs text-red-600">{fieldErrors.service[0]}</span>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-zinc-700">
            Faixa de investimento
          </span>
          <select
            value={budgetRange}
            onChange={(event) => setBudgetRange(event.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          >
            {budgetRangeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {fieldErrors.budgetRange?.[0] ? (
            <span className="mt-1 block text-xs text-red-600">{fieldErrors.budgetRange[0]}</span>
          ) : null}
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-zinc-700">Prazo</span>
          <select
            value={timeline}
            onChange={(event) => setTimeline(event.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          >
            {timelineOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {fieldErrors.timeline?.[0] ? (
            <span className="mt-1 block text-xs text-red-600">{fieldErrors.timeline[0]}</span>
          ) : null}
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-zinc-700">Contexto do projeto</span>
        <textarea
          required
          value={projectBrief}
          onChange={(event) => setProjectBrief(event.target.value)}
          className="min-h-32 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          placeholder="Descreva objetivo, escopo inicial, prazo e referencias."
        />
        {fieldErrors.projectBrief?.[0] ? (
          <span className="mt-1 block text-xs text-red-600">{fieldErrors.projectBrief[0]}</span>
        ) : null}
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-zinc-700">
          Anexo opcional (briefing, PDF, imagem)
        </span>
        <input
          type="file"
          accept={acceptedFileTypes}
          onChange={(event) => {
            const nextFile = event.target.files?.[0];
            setAttachment(nextFile);
          }}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-700 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-zinc-700"
        />
        <span className="mt-1 block text-xs text-zinc-500">
          Limite: {maxAttachmentSizeMb}MB. Formatos: {allowedAttachmentMimeTypes.join(", ")}
        </span>
        {fieldErrors.attachment?.[0] ? (
          <span className="mt-1 block text-xs text-red-600">{fieldErrors.attachment[0]}</span>
        ) : null}
      </label>

      {feedback ? (
        <p
          role="status"
          aria-live="polite"
          className={`rounded-md px-3 py-2 text-sm ${isError ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}
        >
          {feedback}
        </p>
      ) : null}

      {whatsappLink && !isError ? (
        <a
          href={whatsappLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-full justify-center rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-100"
        >
          Continuar no WhatsApp
        </a>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Enviando..." : "Enviar solicitacao"}
      </button>
    </form>
  );
};
