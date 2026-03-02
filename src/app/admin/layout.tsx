import { getServerSession } from "next-auth";

import { LogoutButton } from "@/components/auth/logout-button";
import { AdminNav } from "@/components/admin/admin-nav";
import { authOptions } from "@/lib/auth/options";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return <>{children}</>;
  }

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8">
      <section className="mx-auto max-w-5xl rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">Painel Administrativo</h1>
            <p className="mt-1 text-sm text-zinc-600">Acesso baseado em papel (RBAC).</p>
          </div>
          <LogoutButton />
        </div>

        <div className="mt-4">
          <AdminNav role={session.user.role} />
        </div>

        <div className="mt-6">{children}</div>
      </section>
    </main>
  );
}
