import { redirect } from "next/navigation";

import { AdminSessionStatus } from "@/components/auth/admin-session-status";
import { requirePermission } from "@/lib/auth/guards";
import { loadAdminDashboardData } from "@/services/admin-dashboard.service";

export default async function AdminPage() {
  const permissionCheck = await requirePermission("dashboard:view");
  if (!permissionCheck.ok) {
    redirect("/admin/login");
  }

  const dashboard = await loadAdminDashboardData();
  const maxTrend = Math.max(
    ...dashboard.analytics.leadTrendLast7Days.map((point) => point.total),
    1,
  );

  return (
    <section className="space-y-6">
      <AdminSessionStatus />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <article className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-xs font-semibold text-zinc-500 uppercase">Leads hoje</p>
          <p className="mt-2 text-2xl font-semibold text-zinc-900">{dashboard.leadCards.day}</p>
        </article>
        <article className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-xs font-semibold text-zinc-500 uppercase">Leads semana</p>
          <p className="mt-2 text-2xl font-semibold text-zinc-900">{dashboard.leadCards.week}</p>
        </article>
        <article className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-xs font-semibold text-zinc-500 uppercase">Leads mes</p>
          <p className="mt-2 text-2xl font-semibold text-zinc-900">{dashboard.leadCards.month}</p>
        </article>
        <article className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-xs font-semibold text-zinc-500 uppercase">Posts publicados</p>
          <p className="mt-2 text-2xl font-semibold text-zinc-900">
            {dashboard.posts.published}
            <span className="ml-1 text-sm font-medium text-zinc-500">
              / {dashboard.posts.total}
            </span>
          </p>
        </article>
        <article className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-xs font-semibold text-zinc-500 uppercase">Alertas (24h)</p>
          <p className="mt-2 text-2xl font-semibold text-zinc-900">
            {dashboard.alerts.totalLast24h}
          </p>
        </article>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
        <article className="rounded-md border border-zinc-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-zinc-900">Visualizacao de leads</h2>
          {dashboard.analytics.integrated ? (
            <div className="mt-4 space-y-3">
              <p className="text-xs text-zinc-500">
                Analytics integrado: <strong>{dashboard.analytics.source}</strong>
              </p>
              <div className="space-y-2">
                {dashboard.analytics.leadTrendLast7Days.map((point) => (
                  <div
                    key={point.date}
                    className="grid grid-cols-[96px_1fr_36px] items-center gap-2"
                  >
                    <span className="text-xs text-zinc-500">{point.date}</span>
                    <div className="h-2 rounded bg-zinc-200">
                      <div
                        className="h-2 rounded bg-zinc-800"
                        style={{
                          width: `${Math.max((point.total / maxTrend) * 100, point.total > 0 ? 8 : 0)}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-zinc-700">{point.total}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-zinc-600">
              Integracao de analytics nao detectada. Defina `NEXT_PUBLIC_GA_ID` para habilitar
              visualizacoes.
            </p>
          )}
        </article>

        <article className="rounded-md border border-zinc-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-zinc-900">Alertas recentes</h2>
          <div className="mt-3 space-y-3">
            {dashboard.alerts.latest.length === 0 ? (
              <p className="text-sm text-zinc-600">Sem alertas nas ultimas 24 horas.</p>
            ) : (
              dashboard.alerts.latest.map((alert) => (
                <div key={alert.id} className="rounded border border-zinc-200 bg-zinc-50 p-3">
                  <p className="text-xs font-semibold text-zinc-700">
                    {alert.category} · {alert.context}
                  </p>
                  <p className="mt-1 text-xs text-zinc-600">{alert.message}</p>
                  <p className="mt-1 text-[11px] text-zinc-500">{alert.timestamp}</p>
                </div>
              ))
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
