type BuildLeadWhatsappLinkInput = {
  leadId: string;
  leadName: string;
  source: "CONTACT_FORM" | "BUDGET_FORM";
};

const getWhatsappDigits = () => {
  const raw = process.env.SITE_CONTACT_WHATSAPP || "";
  const digits = raw.replace(/[^\d]/g, "");
  return digits || null;
};

export const buildLeadWhatsappLink = (input: BuildLeadWhatsappLinkInput) => {
  const whatsappDigits = getWhatsappDigits();
  if (!whatsappDigits) {
    return null;
  }

  const text = encodeURIComponent(
    `Ola, sou ${input.leadName}. Abri o lead ${input.leadId} (${input.source}) e quero continuar pelo WhatsApp.`,
  );

  return `https://wa.me/${whatsappDigits}?text=${text}`;
};
