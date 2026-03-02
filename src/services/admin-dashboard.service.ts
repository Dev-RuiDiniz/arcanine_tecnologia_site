import { prisma } from "@/lib/db/prisma";
import { listTelemetryEvents } from "@/lib/telemetry/events";

type DashboardAlert = {
  id: string;
  category: "FORM_ERROR" | "EMAIL_DELIVERY_ERROR";
  context: string;
  message: string;
  timestamp: string;
};

type LeadTrendPoint = {
  date: string;
  total: number;
};

export type AdminDashboardData = {
  leadCards: {
    day: number;
    week: number;
    month: number;
  };
  posts: {
    total: number;
    published: number;
  };
  alerts: {
    totalLast24h: number;
    latest: DashboardAlert[];
  };
  analytics: {
    integrated: boolean;
    source: string | null;
    leadTrendLast7Days: LeadTrendPoint[];
  };
};

const startOfDay = (date = new Date()) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

const startOfWeek = (date = new Date()) => {
  const next = startOfDay(date);
  const dayOfWeek = next.getDay();
  const distanceToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  next.setDate(next.getDate() - distanceToMonday);
  return next;
};

const startOfMonth = (date = new Date()) => {
  const next = startOfDay(date);
  next.setDate(1);
  return next;
};

const buildLast7Days = () => {
  const days: Date[] = [];
  const now = startOfDay();
  for (let index = 6; index >= 0; index -= 1) {
    const point = new Date(now);
    point.setDate(now.getDate() - index);
    days.push(point);
  }
  return days;
};

const formatDateKey = (date: Date) => date.toISOString().slice(0, 10);

const resolveAnalyticsSource = () => {
  if (process.env.NEXT_PUBLIC_GA_ID) {
    return "Google Analytics";
  }
  if (process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN) {
    return "Plausible";
  }
  return null;
};

export const loadAdminDashboardData = async (): Promise<AdminDashboardData> => {
  const now = new Date();
  const [leadsDay, leadsWeek, leadsMonth, totalPages, publishedPages] = await Promise.all([
    prisma.lead.count({ where: { createdAt: { gte: startOfDay(now) } } }),
    prisma.lead.count({ where: { createdAt: { gte: startOfWeek(now) } } }),
    prisma.lead.count({ where: { createdAt: { gte: startOfMonth(now) } } }),
    prisma.page.count(),
    prisma.page.count({ where: { published: true } }),
  ]);

  const timelineDates = buildLast7Days();
  const trendStart = timelineDates[0];
  const trendLeads = await prisma.lead.findMany({
    where: {
      createdAt: {
        gte: trendStart,
      },
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const trendMap = new Map<string, number>();
  for (const day of timelineDates) {
    trendMap.set(formatDateKey(day), 0);
  }

  for (const lead of trendLeads) {
    const dateKey = formatDateKey(lead.createdAt);
    trendMap.set(dateKey, (trendMap.get(dateKey) || 0) + 1);
  }

  const leadTrendLast7Days = Array.from(trendMap.entries()).map(([date, total]) => ({
    date,
    total,
  }));

  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const recentEvents = await listTelemetryEvents({ limit: 100, since: last24h });
  const latestAlerts = recentEvents.slice(0, 6).map((event) => ({
    id: event.id,
    category: event.category,
    context: event.context,
    message: event.message,
    timestamp: event.timestamp,
  }));

  const analyticsSource = resolveAnalyticsSource();

  return {
    leadCards: {
      day: leadsDay,
      week: leadsWeek,
      month: leadsMonth,
    },
    posts: {
      total: totalPages,
      published: publishedPages,
    },
    alerts: {
      totalLast24h: recentEvents.length,
      latest: latestAlerts,
    },
    analytics: {
      integrated: Boolean(analyticsSource),
      source: analyticsSource,
      leadTrendLast7Days,
    },
  };
};
