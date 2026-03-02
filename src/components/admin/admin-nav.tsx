import Link from "next/link";

import type { AppRole } from "@/lib/auth/rbac";
import { hasPermission } from "@/lib/auth/rbac";

type AdminNavProps = {
  role: AppRole;
};

const navItems = [
  { href: "/admin", label: "Dashboard", permission: "dashboard:view" as const },
  { href: "/admin/pages", label: "Paginas", permission: "pages:view" as const },
  { href: "/admin/cases", label: "Cases", permission: "pages:view" as const },
  { href: "/admin/posts", label: "Posts", permission: "pages:view" as const },
  { href: "/admin/leads", label: "Leads", permission: "leads:view" as const },
  { href: "/admin/settings", label: "Configuracoes", permission: "settings:manage" as const },
];

export const AdminNav = ({ role }: AdminNavProps) => {
  const visibleItems = navItems.filter((navItem) => hasPermission(role, navItem.permission));

  return (
    <nav className="flex flex-wrap gap-2">
      {visibleItems.map((navItem) => (
        <Link
          key={navItem.href}
          href={navItem.href}
          className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
        >
          {navItem.label}
        </Link>
      ))}
    </nav>
  );
};
