import nodemailer from "nodemailer";

import type { LeadSource } from "@prisma/client";

import { reportEmailDeliveryError } from "@/lib/monitoring/email-delivery";

type LeadEmailNotificationInput = {
  leadId: string;
  leadName: string;
  leadEmail: string;
  leadPhone?: string | null;
  projectType?: string | null;
  message: string;
  source: LeadSource;
  status: string;
  createdAt: Date;
};

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  internalTo: string;
};

type LeadEmailNotificationResult = {
  internalNotificationSent: boolean;
  clientConfirmationSent: boolean;
};

const parseSmtpConfig = (): SmtpConfig | null => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM;
  const internalTo = process.env.LEAD_INTERNAL_NOTIFICATION_EMAIL;
  const port = Number.parseInt(process.env.SMTP_PORT || "587", 10);
  const secure = process.env.SMTP_SECURE === "true";

  if (!host || !user || !pass || !from || !internalTo || !Number.isFinite(port)) {
    return null;
  }

  return {
    host,
    port,
    secure,
    user,
    pass,
    from,
    internalTo,
  };
};

const formatLeadSummary = (input: LeadEmailNotificationInput) => {
  return [
    `Lead ID: ${input.leadId}`,
    `Origem: ${input.source}`,
    `Status inicial: ${input.status}`,
    `Nome: ${input.leadName}`,
    `E-mail: ${input.leadEmail}`,
    `Telefone: ${input.leadPhone || "-"}`,
    `Servico: ${input.projectType || "-"}`,
    `Data: ${input.createdAt.toISOString()}`,
    "",
    "Mensagem:",
    input.message,
  ].join("\n");
};

export const notifyLeadByEmail = async (
  input: LeadEmailNotificationInput,
): Promise<LeadEmailNotificationResult> => {
  const smtpConfig = parseSmtpConfig();

  if (!smtpConfig) {
    return {
      internalNotificationSent: false,
      clientConfirmationSent: false,
    };
  }

  const transporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.secure,
    auth: {
      user: smtpConfig.user,
      pass: smtpConfig.pass,
    },
  });

  let internalNotificationSent = false;
  let clientConfirmationSent = false;

  try {
    await transporter.sendMail({
      from: smtpConfig.from,
      to: smtpConfig.internalTo,
      subject: `[Lead] ${input.source} - ${input.leadName}`,
      text: formatLeadSummary(input),
    });
    internalNotificationSent = true;
  } catch (error) {
    await reportEmailDeliveryError("lead-internal-notification", error, {
      leadId: input.leadId,
      source: input.source,
    });
  }

  try {
    await transporter.sendMail({
      from: smtpConfig.from,
      to: input.leadEmail,
      subject: "Recebemos sua solicitacao - Arcanine Tecnologia",
      text: [
        `Oi, ${input.leadName}.`,
        "",
        "Recebemos seu contato com sucesso e nossa equipe retornara em breve.",
        `Protocolo: ${input.leadId}`,
        "",
        "Arcanine Tecnologia",
      ].join("\n"),
    });
    clientConfirmationSent = true;
  } catch (error) {
    await reportEmailDeliveryError("lead-client-confirmation", error, {
      leadId: input.leadId,
      source: input.source,
    });
  }

  return {
    internalNotificationSent,
    clientConfirmationSent,
  };
};
