export type AnalyticsEventName =
  | "lead_submit_contact"
  | "lead_submit_budget"
  | "whatsapp_click"
  | "budget_cta_click";

type AnalyticsEventPayload = {
  name: AnalyticsEventName;
  category: "lead" | "engagement";
  label?: string;
  value?: number;
  metadata?: Record<string, string | number | boolean | null | undefined>;
};

type WindowWithTrackers = Window & {
  gtag?: (...args: unknown[]) => void;
  plausible?: (eventName: string, options?: { props?: Record<string, unknown> }) => void;
};

export const trackAnalyticsEvent = (payload: AnalyticsEventPayload) => {
  if (typeof window === "undefined") {
    return;
  }

  const w = window as WindowWithTrackers;

  if (typeof w.gtag === "function") {
    w.gtag("event", payload.name, {
      event_category: payload.category,
      event_label: payload.label,
      value: payload.value,
      ...payload.metadata,
    });
  }

  if (typeof w.plausible === "function") {
    w.plausible(payload.name, {
      props: {
        category: payload.category,
        label: payload.label,
        ...payload.metadata,
      },
    });
  }

  fetch("/api/analytics/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {
    // avoid surfacing analytics failures to users
  });
};
