import type { GlobalSiteInfo } from "@/lib/site/global-site-info";

type PublicFooterProps = {
  siteInfo: GlobalSiteInfo;
};

export const PublicFooter = ({ siteInfo }: PublicFooterProps) => {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-950 text-zinc-100">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-10">
        <div>
          <h3 className="text-lg font-semibold">{siteInfo.companyName}</h3>
          <p className="mt-2 text-sm text-zinc-300">
            Solucoes digitais com foco em performance, SEO e conversao de leads.
          </p>
        </div>

        <div className="text-sm">
          <p className="font-semibold text-white">Contato</p>
          <p className="mt-2 text-zinc-300">E-mail: {siteInfo.email}</p>
          <p className="text-zinc-300">Telefone: {siteInfo.phone}</p>
          <p className="text-zinc-300">WhatsApp: {siteInfo.whatsapp}</p>
        </div>

        <div className="text-sm">
          <p className="font-semibold text-white">Endereco</p>
          <p className="mt-2 text-zinc-300">{siteInfo.address.street}</p>
          <p className="text-zinc-300">
            {siteInfo.address.city} - {siteInfo.address.state}
          </p>
          <p className="text-zinc-300">
            {siteInfo.address.zipCode} - {siteInfo.address.country}
          </p>
        </div>
      </div>

      <div className="border-t border-zinc-800">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 text-xs text-zinc-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
          <p>
            © {new Date().getFullYear()} {siteInfo.companyName}. Todos os direitos reservados.
          </p>
          <div className="flex flex-wrap gap-3">
            {siteInfo.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="hover:text-zinc-100"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
