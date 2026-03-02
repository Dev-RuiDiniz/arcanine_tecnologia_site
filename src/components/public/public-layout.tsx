import { PublicFooter } from "@/components/public/public-footer";
import { PublicHeader } from "@/components/public/public-header";
import { loadPublicSiteConfig } from "@/services/site-config.service";

export const PublicLayout = async ({ children }: { children: React.ReactNode }) => {
  const siteInfo = await loadPublicSiteConfig();

  return (
    <div className="min-h-screen bg-zinc-100">
      <PublicHeader />
      {children}
      <PublicFooter siteInfo={siteInfo} />
    </div>
  );
};
