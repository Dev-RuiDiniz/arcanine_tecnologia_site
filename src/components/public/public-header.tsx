import Link from "next/link";

import { CtaLink } from "@/components/public/cta-link";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Servicos", href: "#servicos" },
  { label: "Diferenciais", href: "#diferenciais" },
  { label: "Contato", href: "#contato" },
];

export const PublicHeader = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10">
        <Link href="/" className="text-base font-semibold tracking-tight text-zinc-900 sm:text-lg">
          Arcanine Tecnologia
        </Link>
        <nav className="hidden items-center gap-5 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-zinc-600 hover:text-zinc-900"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <CtaLink href="/admin/login" variant="primary">
          Falar com especialista
        </CtaLink>
      </div>
    </header>
  );
};
