"use client";

import { useState } from "react";

import { submitContactForm as submitContactFormRequest } from "@/lib/api/forms";
import { contactLeadSchema } from "@/schemas/forms/contact";

type ContactFormProps = {
  defaultProjectType?: string;
};

const projectTypes = [
  { value: "site", label: "Site institucional" },
  { value: "sistema", label: "Sistema web" },
  { value: "automacao", label: "Automacao" },
  { value: "ia", label: "IA aplicada" },
];

export const ContactForm = ({ defaultProjectType = "site" }: ContactFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [projectType, setProjectType] = useState(defaultProjectType);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setFeedback(null);
    setIsError(false);
    setFieldErrors({});
    setWhatsappLink(null);

    const parsed = contactLeadSchema.safeParse({
      name,
      email,
      phone,
      projectType,
      message,
    });

    if (!parsed.success) {
      setLoading(false);
      setIsError(true);
      setFeedback("Revise os campos obrigatorios antes de enviar.");
      setFieldErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    try {
      const payload = await submitContactFormRequest(parsed.data);
      if (!payload.ok) {
        setIsError(true);
        setFeedback(payload.error || "Nao foi possivel enviar o contato.");
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
      setFeedback(`Mensagem enviada com sucesso. ${deliveryStatus}`);
      setWhatsappLink(payload.data.whatsappLink || null);
      setName("");
      setEmail("");
      setPhone("");
      setProjectType(defaultProjectType);
      setMessage("");
    } catch {
      setIsError(true);
      setFeedback("Falha de conexao ao enviar o formulario.");
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
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-zinc-700">Nome</span>
        <input
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          placeholder="Seu nome"
        />
        {fieldErrors.name?.[0] ? (
          <span className="mt-1 block text-xs text-red-600">{fieldErrors.name[0]}</span>
        ) : null}
      </label>

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
        <span className="mb-1 block text-sm font-medium text-zinc-700">Telefone / WhatsApp</span>
        <input
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          placeholder="+55 11 99999-9999"
        />
        {fieldErrors.phone?.[0] ? (
          <span className="mt-1 block text-xs text-red-600">{fieldErrors.phone[0]}</span>
        ) : null}
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-zinc-700">Tipo de projeto</span>
        <select
          value={projectType}
          onChange={(event) => setProjectType(event.target.value)}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
        >
          {projectTypes.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        {fieldErrors.projectType?.[0] ? (
          <span className="mt-1 block text-xs text-red-600">{fieldErrors.projectType[0]}</span>
        ) : null}
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-zinc-700">Mensagem</span>
        <textarea
          required
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="min-h-32 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
          placeholder="Conte um pouco sobre seu objetivo e contexto."
        />
        {fieldErrors.message?.[0] ? (
          <span className="mt-1 block text-xs text-red-600">{fieldErrors.message[0]}</span>
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
        {loading ? "Enviando..." : "Enviar mensagem"}
      </button>
    </form>
  );
};
